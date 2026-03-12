module.exports = function maskPhone(phone) {
  return phone.replace(/(\d{5})\d{4}/, "$1XXXX");
};
