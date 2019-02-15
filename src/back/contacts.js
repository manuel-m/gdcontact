import model from './model';

export default function(req, res) {
  console.log(req.body);
  return res.json(model.data.contacts);
}
