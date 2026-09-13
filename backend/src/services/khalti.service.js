const axios = require('axios');

function client() {
  return axios.create({
    baseURL: process.env.KHALTI_BASE_URL || 'https://a.khalti.com/api/v2',
    headers: { Authorization: `Key ${process.env.KHALTI_SECRET_KEY || ''}` },
    timeout: 15000
  });
}

async function initiatePayment({ amountRupees, purchaseOrderId, purchaseOrderName, customerInfo }) {
  const { data } = await client().post('/epayment/initiate/', {
    return_url: `${process.env.CLIENT_URL}/payment/status`,
    website_url: process.env.CLIENT_URL,
    amount: Math.round(amountRupees * 100),
    purchase_order_id: purchaseOrderId,
    purchase_order_name: purchaseOrderName,
    customer_info: customerInfo
  });
  return data;
}

async function lookupPayment(pidx) {
  const { data } = await client().post('/epayment/lookup/', { pidx });
  return data;
}

module.exports = { initiatePayment, lookupPayment };