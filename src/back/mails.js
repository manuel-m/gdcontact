import model from './model';

export default {
  middleware,
};

function middleware(req, res) {
  console.log(req.body);
  return res.json(model.data.mails);
}
