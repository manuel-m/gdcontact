import model from './model';

export default function(req, res) {
  return res.json(model.data.contacts);
}
