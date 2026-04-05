const Razorpay = require('razorpay');
const r = new Razorpay({
  key_id: 'rzp_test_SZP47AdnUPsgKF',
  key_secret: 'ZNyfcNwNo45T3SS6ZHVDEl05',
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
