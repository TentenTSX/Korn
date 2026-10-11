// Scalar subquery returning the current active sale's discount_percent, or
// NULL when no sale is running. Inlined into price-selecting queries so the
// discount is computed once, consistently, at the database layer.
export const ACTIVE_DISCOUNT_PERCENT_SQL =
  "(select discount_percent from sale_periods where curdate() between start_date and end_date order by start_date desc limit 1)";
