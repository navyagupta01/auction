exports.formatPrice = (value) =>
  Number(value).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  });

exports.formatDate = (date) => {
  const d = new Date(date);
  return isNaN(d) ? 'Invalid date' : d.toLocaleString();
};

exports.isEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

exports.randomString = (length = 12) =>
  Math.random().toString(36).slice(2, 2 + length);
