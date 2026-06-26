const Razorpay = require('razorpay');
const r = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

r.orders.create({
  amount: 100,
  currency: 'INR',
  receipt: 'test_' + Date.now(),
})
  .then((order) => {
    console.log('SUCCESS', order);
  })
  .catch((error) => {
    console.error('ERROR', error);
    process.exit(1);
  });
