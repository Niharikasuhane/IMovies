// Parses ?page & ?limit and returns helpers for pagination.
exports.getPagination = (query, defaultLimit = 10, maxLimit = 50) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || defaultLimit, 1), maxLimit);
  return { page, limit, skip: (page - 1) * limit };
};
exports.pageMeta = (total, page, limit) => ({
  total, page, limit, pages: Math.ceil(total / limit) || 1,
});
