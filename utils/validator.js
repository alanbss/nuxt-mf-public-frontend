import Vue from 'vue'
import VeeValidate, {
  Validator
} from 'vee-validate'

Vue.use(VeeValidate)

Validator.localize('pt_BR', {
  custom: {
    name: {
      required: 'Um nome fantasia é essencial.',
      email: 'Informe um e-mail válido',
    },
    legal_name: {
      required: 'A razão social da sua empresa é essencial.',
    },
    cnpj: {
      required: 'O CNPJ da sua empresa é essencial.',
      length: 'Informe um CNPJ válido.',
      is: 'CNPJ em uso.',
    },
    cpf: {
      required: 'O seu CPF é essencial.',
      length: 'Informe um CPF válido',
      is: 'CPF em uso.',
    },
    contact_name: {
      required: 'Seu nome é essencial.',
    },
    whatsapp: {
      required: 'Seu Whatsapp é essencial.',
      min: 'Você deve informar um Whatsapp válido.',
      max: 'Você deve informar um Whatsapp válido.',
    },
    phone: {
      required: 'Seu número de telefone é essencial.',
      min: 'Você deve informar um Telefone válido.',
      max: 'Você deve informar um Telefone válido.',
    },
    zipcode: {
      required: 'O número do CEP do seu negócio é essencial.',
      length: 'Você deve informar um número de CEP válido.'
    },
    street: {
      required: 'O endereço do seu negócio é essencial.'
    },
    address_details: {
      required: 'O Número e complemento do seu negócio são essenciais.'
    },
    neighborhood: {
      required: 'O nome do bairro é essencial.'
    },
    email: {
      required: 'Informe o seu e-mail.',
      email: 'Informe um e-mail válido.',
      is: 'Email em uso.',
    },
    email_confirmation: {
      required: 'Informe o seu e-mail novamente.',
      confirmed: 'O e-mail de confirmação está diferente do e-mail informado.'
    },
    password: {
      required: 'Informe sua senha.'
    },
    price: {
      required: 'Defina o preço ou deixe indisp.',
      excluded: 'Defina o preço ou deixe indisp.'
    },
    quantity: {
      min_value: 'Qtd. abaixo da mín. exigida.'
    },
    payment_method: {
      excluded: 'Pagamento já existe.',
      required: 'Não pode ser vazio.'
    },
  },
});
