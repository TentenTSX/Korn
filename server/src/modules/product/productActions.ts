import ActionError from "../ActionError";
import productRepository from "./productRepository";

type ProductFilters = { category?: string; gender?: string; search?: string };

const getProductsAction = (filters: ProductFilters) =>
  productRepository.findAll(filters);

const getProductAction = async (id: number) => {
  if (!Number.isInteger(id) || id < 1) {
    throw new ActionError("BAD_REQUEST", "Identifiant produit invalide.");
  }
  const products = await productRepository.findById(id);
  if (products.length === 0) {
    throw new ActionError("NOT_FOUND", "Produit introuvable.");
  }
  return products;
};

const getCategoriesAction = () => productRepository.findCategories();

export default { getProductsAction, getProductAction, getCategoriesAction };
