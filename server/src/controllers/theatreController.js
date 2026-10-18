const Theatre = require('../models/Theatre');
const Show = require('../models/Show');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { getPagination, pageMeta } = require('../utils/paginate');

exports.getTheatres = asyncHandler(async (req, res) => {
  const { city } = req.query;
  const { page, limit, skip } = getPagination(req.query, 20, 100);
  const filter = {};
  if (city) filter.city = new RegExp(`^${city}$`, 'i');
  if (req.query.all !== 'true') filter.isActive = true;
  const [data, total] = await Promise.all([
    Theatre.find(filter).sort({ city: 1, name: 1 }).skip(skip).limit(limit),
    Theatre.countDocuments(filter),
  ]);
  res.json({ success: true, data, pagination: pageMeta(total, page, limit) });
});

exports.getTheatre = asyncHandler(async (req, res) => {
  const t = await Theatre.findById(req.params.id);
  if (!t) throw new AppError('Theatre not found', 404);
  res.json({ success: true, data: t });
});

exports.createTheatre = asyncHandler(async (req, res) => {
  res.status(201).json({ success: true, data: await Theatre.create(req.body) });
});

exports.updateTheatre = asyncHandler(async (req, res) => {
  const t = await Theatre.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!t) throw new AppError('Theatre not found', 404);
  res.json({ success: true, data: t });
});

exports.deleteTheatre = asyncHandler(async (req, res) => {
  const t = await Theatre.findById(req.params.id);
  if (!t) throw new AppError('Theatre not found', 404);
  if (await Show.exists({ theatre: t._id, status: 'scheduled', startTime: { $gte: new Date() } })) {
    throw new AppError('Theatre has upcoming shows. Cancel them first.', 400);
  }
  await t.deleteOne();
  res.json({ success: true, message: 'Theatre deleted' });
});
