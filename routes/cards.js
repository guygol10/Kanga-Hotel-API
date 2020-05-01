const express = require("express");
const _ = require("lodash");
const { Card, validateCard, generateBizNumber } = require("../models/card");
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/my-cards", auth, async (req, res) => {
  if (!req.user.biz) return res.status(401).send("Access denied.");
  const cards = await Card.find({ user_id: req.user._id });
  res.send(cards);
});

router.delete("/:id", auth, async (req, res) => {
  const card = await Card.findOneAndRemove({
    _id: req.params.id,
    user_id: req.user._id
  });
  if (!card)
    return res.status(404).send("The card with the given ID was not found.");
  res.send(card);
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validateCard(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let card = await Card.findOneAndUpdate(
    { _id: req.params.id, user_id: req.user._id },
    req.body
  );
  if (!card)
    return res.status(404).send("The card with the given ID was not found.");

  card = await Card.findOne({ _id: req.params.id, user_id: req.user._id });
  res.send(card);
});

router.get("/:id", auth, async (req, res) => {
  const card = await Card.findOne({
    _id: req.params.id,
    user_id: req.user._id
  });
  if (!card)
    return res.status(404).send("The card with the given ID was not found.");
  res.send(card);
});

router.post("/", auth, async (req, res) => {
  const { error } = validateCard(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let card = new Card({
    roomName: req.body.roomName,
     description: req.body.dscription,
    type: req.body.type,
    price: req.body.price,
    size: req.body.size,
    capacity: req.body.capacity,
    roomImage: req.body.roomImage
      ? req.body.bizImage
      : "https://cdn.pixabay.com/photo/2016/04/15/11/46/hotel-1330846_1280.jpg",
     bizNumber: await generateBizNumber(Card),
    user_id: req.user._id
  });

  post = await card.save();
  res.send(post);
});

module.exports = router;
