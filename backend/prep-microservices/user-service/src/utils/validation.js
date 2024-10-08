const Joi = require("joi");

const registrationSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  mobile: Joi.string().required(),
  college: Joi.string(),
  branch: Joi.string(),
  yearOfPassing: Joi.number(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const profileUpdateSchema = Joi.object({
  name: Joi.string(),
  mobile: Joi.string(),
  college: Joi.string(),
  branch: Joi.string(),
  yearOfPassing: Joi.number(),
  linkedinId: Joi.string(),
  visibility: Joi.boolean(),
  projects: Joi.array().items(
    Joi.object({
      title: Joi.string().required(),
      description: Joi.string().required(),
      link: Joi.string().uri(),
    })
  ),
  education: Joi.array().items(
    Joi.object({
      institution: Joi.string().required(),
      degree: Joi.string().required(),
      field: Joi.string().required(),
      startDate: Joi.date().required(),
      endDate: Joi.date(),
    })
  ),
  skills: Joi.array().items(Joi.string()),
});

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

module.exports = {
  validateRegistration: validate(registrationSchema),
  validateLogin: validate(loginSchema),
  validateProfileUpdate: validate(profileUpdateSchema),
};
