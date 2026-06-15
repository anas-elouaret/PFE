const User = require("../models/User");
const Project = require("../models/Project");
const Order = require("../models/Order");
const Contact = require("../models/Contact");

exports.getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalProjects, totalOrders, totalContacts, unreadContacts, revenueResult] =
      await Promise.all([
        User.countDocuments(),
        Project.countDocuments(),
        Order.countDocuments(),
        Contact.countDocuments(),
        Contact.countDocuments({ isRead: false }),
        Order.aggregate([
          { $match: { paymentStatus: "paid" } },
          { $group: { _id: null, total: { $sum: "$total" } } },
        ]),
      ]);

    const projectStatusCounts = await Project.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const recentProjects = await Project.find().sort({ createdAt: -1 }).limit(5).lean();

    res.json({
      stats: {
        totalUsers,
        totalProjects,
        totalOrders,
        totalContacts,
        unreadContacts,
        totalRevenue: revenueResult[0]?.total || 0,
        projectStatusCounts: projectStatusCounts.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
      },
      recentProjects,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const monthlyUsers = await User.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 12 },
    ]);

    const monthlyOrders = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          count: { $sum: 1 },
          revenue: { $sum: "$total" },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 12 },
    ]);

    res.json({
      monthlyUsers,
      monthlyOrders,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
};
