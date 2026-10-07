import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";
import type CartOwner from "./CartOwner";

function ownerFilter(owner: CartOwner, alias = "c") {
  return owner.kind === "user"
    ? { clause: `${alias}.user_id = ?`, value: owner.userId }
    : { clause: `${alias}.guest_token_hash = ?`, value: owner.guestTokenHash };
}

class CartRepository {
  async findVariant(variantId: number) {
    const [rows] = await databaseClient.query<Rows>(
      "select id_variant, price, stock_quantity from product_variants where id_variant = ?",
      [variantId],
    );
    return rows[0] as
      | { id_variant: number; price: number; stock_quantity: number }
      | undefined;
  }

  async findItemByOwner(owner: CartOwner, itemId: number) {
    const filter = ownerFilter(owner);
    const [rows] = await databaseClient.query<Rows>(
      `select ci.variant_id from cart_items ci join carts c on c.id_cart = ci.cart_id where ${filter.clause} and ci.id_cart_item = ?`,
      [filter.value, itemId],
    );
    return rows[0] as { variant_id: number } | undefined;
  }

  async findCartItemByVariant(owner: CartOwner, variantId: number) {
    const filter = ownerFilter(owner);
    const [rows] = await databaseClient.query<Rows>(
      `select ci.quantity from cart_items ci join carts c on c.id_cart = ci.cart_id where ${filter.clause} and ci.variant_id = ?`,
      [filter.value, variantId],
    );
    return rows[0] as { quantity: number } | undefined;
  }

  async findCheckoutItems(owner: CartOwner) {
    const filter = ownerFilter(owner);
    const [rows] = await databaseClient.query<Rows>(
      `select ci.variant_id, ci.quantity, pv.price as price_unit, pv.stock_quantity, p.name, pv.size, pv.color from carts c join cart_items ci on ci.cart_id = c.id_cart join product_variants pv on pv.id_variant = ci.variant_id join products p on p.id_product = pv.product_id where ${filter.clause}`,
      [filter.value],
    );
    return rows as Array<{
      variant_id: number;
      quantity: number;
      price_unit: number | string;
      stock_quantity: number;
      name: string;
      size: string;
      color: string;
    }>;
  }

  async findByOwner(owner: CartOwner) {
    const filter = ownerFilter(owner);
    const [rows] = await databaseClient.query<Rows>(
      `select c.id_cart, ci.id_cart_item, ci.variant_id, ci.quantity, pv.price as price_unit, p.id_product, p.name, pv.size, pv.color, pv.stock_quantity, (select pi.url from product_images pi where pi.product_id = p.id_product and (pi.color = pv.color or pi.color is null) order by (pi.color = pv.color) desc, pi.position limit 1) as image from carts c join cart_items ci on ci.cart_id = c.id_cart join product_variants pv on pv.id_variant = ci.variant_id join products p on p.id_product = pv.product_id where ${filter.clause}`,
      [filter.value],
    );
    return rows;
  }

  async addItem(
    owner: CartOwner,
    variantId: number,
    quantity: number,
    price: number,
  ) {
    const cartId = await this.ensureCart(owner);
    await databaseClient.query<Result>(
      "insert into cart_items (cart_id, variant_id, quantity, price_unit) values (?, ?, ?, ?) on duplicate key update quantity = quantity + values(quantity)",
      [cartId, variantId, quantity, price],
    );
  }

  async updateItem(owner: CartOwner, itemId: number, quantity: number) {
    const filter = ownerFilter(owner);
    const [result] = await databaseClient.query<Result>(
      `update cart_items ci join carts c on c.id_cart = ci.cart_id set ci.quantity = ? where ${filter.clause} and ci.id_cart_item = ?`,
      [quantity, filter.value, itemId],
    );
    return result.affectedRows;
  }

  async removeItem(owner: CartOwner, itemId: number) {
    const filter = ownerFilter(owner);
    const [result] = await databaseClient.query<Result>(
      `delete ci from cart_items ci join carts c on c.id_cart = ci.cart_id where ${filter.clause} and ci.id_cart_item = ?`,
      [filter.value, itemId],
    );
    return result.affectedRows;
  }

  async ensureCart(owner: CartOwner) {
    if (owner.kind === "user") {
      await databaseClient.query(
        "insert into carts (user_id) values (?) on duplicate key update id_cart = last_insert_id(id_cart)",
        [owner.userId],
      );
      const [rows] = await databaseClient.query<Rows>(
        "select id_cart from carts where user_id = ?",
        [owner.userId],
      );
      return rows[0].id_cart as number;
    }

    await databaseClient.query(
      "insert into carts (guest_token_hash) values (?) on duplicate key update id_cart = last_insert_id(id_cart)",
      [owner.guestTokenHash],
    );
    const [rows] = await databaseClient.query<Rows>(
      "select id_cart from carts where guest_token_hash = ?",
      [owner.guestTokenHash],
    );
    return rows[0].id_cart as number;
  }

  async mergeGuestCartIntoUser(guestTokenHash: string, userId: number) {
    const connection = await databaseClient.getConnection();
    try {
      await connection.beginTransaction();
      const [guestCarts] = await connection.query<Rows>(
        "select id_cart from carts where guest_token_hash = ? for update",
        [guestTokenHash],
      );
      if (guestCarts.length === 0) {
        await connection.commit();
        return;
      }

      await connection.query(
        "insert into carts (user_id) values (?) on duplicate key update id_cart = last_insert_id(id_cart)",
        [userId],
      );
      const [userCarts] = await connection.query<Rows>(
        "select id_cart from carts where user_id = ? for update",
        [userId],
      );
      await connection.query(
        "insert into cart_items (cart_id, variant_id, quantity, price_unit) select ?, ci.variant_id, ci.quantity, pv.price from cart_items ci join product_variants pv on pv.id_variant = ci.variant_id where ci.cart_id = ? on duplicate key update quantity = cart_items.quantity + values(quantity), price_unit = values(price_unit)",
        [userCarts[0].id_cart, guestCarts[0].id_cart],
      );
      await connection.query("delete from carts where id_cart = ?", [
        guestCarts[0].id_cart,
      ]);
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async removePurchasedItems(
    owner: CartOwner,
    items: Array<{ variant_id: number; quantity: number }>,
  ) {
    const filter = ownerFilter(owner);
    const connection = await databaseClient.getConnection();
    try {
      await connection.beginTransaction();
      for (const item of items) {
        await connection.query(
          `update cart_items ci join carts c on c.id_cart = ci.cart_id set ci.quantity = greatest(ci.quantity - ?, 0) where ${filter.clause} and ci.variant_id = ?`,
          [item.quantity, filter.value, item.variant_id],
        );
      }
      await connection.query(
        `delete ci from cart_items ci join carts c on c.id_cart = ci.cart_id where ${filter.clause} and ci.quantity <= 0`,
        [filter.value],
      );
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async clearCart(owner: CartOwner) {
    const filter = ownerFilter(owner);
    await databaseClient.query(
      `delete ci from cart_items ci join carts c on c.id_cart = ci.cart_id where ${filter.clause}`,
      [filter.value],
    );
  }
}

export default new CartRepository();
