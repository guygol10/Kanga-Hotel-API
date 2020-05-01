const Joi = require("@hapi/joi");
const mongoose = require("mongoose");
const _ = require("lodash");

const cardSchema = new mongoose.Schema({
  roomName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
  }, 
  type: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
  },
  price: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 6,
  },
  size: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 5,
  },
  capacity: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 3,
  },
  description: {
    type: String,
    minlength: 2,
    maxlength: 1024,
  }, 
  roomImage: {
    type: String,
    required: true,
    minlength: 11,
    maxlength: 1024,
  },
  bizNumber: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 99999999999,
    unique: true,
  },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Card = mongoose.model("Card", cardSchema);

function validateCard(card) {
  const schema = Joi.object({
    roomName: Joi.string().min(2).max(255).required(),
    type: Joi.string().min(2).max(255).required(),
    price: Joi.string().min(3).max(6).required(),
    size: Joi.string().min(2).max(5).required(),
    capacity: Joi.string().min(1).max(3).required(),
    description: Joi.string().min(2).max(1024),
    roomImage: Joi.string().min(11).max(1024),
  });

  return schema.validate(card);
}

async function generateBizNumber(Card) {
  while (true) {
    let randomNumber = _.random(1000, 999999);
    let card = await Card.findOne({ bizNumber: randomNumber });
    if (!card) return String(randomNumber);
  }
}

exports.Card = Card;
exports.validateCard = validateCard;
exports.generateBizNumber = generateBizNumber;
