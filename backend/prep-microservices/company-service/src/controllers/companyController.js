const Company = require("../models/companyModel");
const asyncHandler = require("express-async-handler");

exports.getCompanies = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search } = req.query;
  const query = search ? { name: { $regex: search, $options: "i" } } : {};

  const companies = await Company.find(query)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();

  const count = await Company.countDocuments(query);

  res.json({
    companies,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
  });
});

exports.getCompany = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id).populate(
    "topics",
    "name"
  );
  if (company) {
    res.json(company);
  } else {
    res.status(404);
    throw new Error("Company not found");
  }
});

exports.createCompany = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    logo,
    backgroundImage,
    locations,
    paperPattern,
    recruitmentProcess,
    industries,
    website,
    foundedYear,
    employeeCount,
    topics,
  } = req.body;

  const company = await Company.create({
    name,
    description,
    logo,
    backgroundImage,
    locations,
    paperPattern,
    recruitmentProcess,
    industries,
    website,
    foundedYear,
    employeeCount,
    topics,
  });

  res.status(201).json(company);
});

exports.updateCompany = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    logo,
    backgroundImage,
    locations,
    paperPattern,
    recruitmentProcess,
    industries,
    website,
    foundedYear,
    employeeCount,
    topics,
  } = req.body;

  const company = await Company.findById(req.params.id);

  if (company) {
    company.name = name || company.name;
    company.description = description || company.description;
    company.logo = logo || company.logo;
    company.backgroundImage = backgroundImage || company.backgroundImage;
    company.locations = locations || company.locations;
    company.paperPattern = paperPattern || company.paperPattern;
    company.recruitmentProcess =
      recruitmentProcess || company.recruitmentProcess;
    company.industries = industries || company.industries;
    company.website = website || company.website;
    company.foundedYear = foundedYear || company.foundedYear;
    company.employeeCount = employeeCount || company.employeeCount;
    company.topics = topics || company.topics;
    company.updatedAt = Date.now();

    const updatedCompany = await company.save();
    res.json(updatedCompany);
  } else {
    res.status(404);
    throw new Error("Company not found");
  }
});

exports.deleteCompany = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);

  if (company) {
    await company.remove();
    res.json({ message: "Company removed" });
  } else {
    res.status(404);
    throw new Error("Company not found");
  }
});
