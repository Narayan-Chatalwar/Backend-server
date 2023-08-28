const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");

//@desc Get all contacts
//@route Get /api/contacts
//@access public

const getallContact = asyncHandler(async (req, res) => {
  const contacts = await Contact.find();
  res.status(200).json(contacts);
});

//@desc Get single contact
//@route Get /api/contacts
//@access public
const getSingleContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404)
    throw new Error("Contact not found");
  }
  res.status(200).json(contact);
});

//@desc Create new Contacts
//@route Post /api/contacts
//@access public
const createContact = asyncHandler(async (req, res) => {
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }

  const contact = await Contact.create({
    name,
    email,
    phone,
  });
  contact.save();

  res.status(201).json(contact);
});

//@desc Update Contact
//@route Put /api/contacts
//@access public
const updateContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }
  const updatedContact = await Contact.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.status(200).json(updatedContact);
});

//@desc Delete Contact
//@route Put /api/contacts
//@access public
const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(401);
    throw new Error({message:'Constact not found'});
  }
  

  await Contact.findByIdAndRemove(req.params.id);
  res.status(200).json(contact);
  
});

module.exports = {
  getallContact,
  getSingleContact,
  createContact,
  updateContact,
  deleteContact,
};
