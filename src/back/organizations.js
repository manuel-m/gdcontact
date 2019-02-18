import model from './model';

export default function(req, res) {
  console.log(req.body);
  return res.json(model.data.organizations);
}

function create() {
  return {
    civility: '',
    first_name: '',
    capacity: '' /* fonction */,
    email: [],
    mailing_address: '',
    phones: [],
    organizationId: '',
  };
}
