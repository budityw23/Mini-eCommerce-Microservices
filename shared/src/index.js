function serviceName(name) {
  if (!name) {
    throw new Error('Name is required');
  }
  return `mini-ecommerce:${name}`;
}

module.exports = {
  serviceName,
};
