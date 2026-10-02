type CartOwner =
  | { kind: "user"; userId: number }
  | { kind: "guest"; guestTokenHash: string };

export default CartOwner;
