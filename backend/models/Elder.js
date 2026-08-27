import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema({
  flatFloor: {
    type: String,
    default: "",
  },

  houseNo: {
    type: String,
    default: "",
  },

  road: {
    type: String,
    default: "",
  },

  areaTahna: {
    type: String,
    default: "",
  },

  city: {
    type: String,
    default: "",
  },

  postalCode: {
    type: String,
    default: "",
  },

  country: {
    type: String,
    default: "Bangladesh",
  },
});

// Bangladeshi mobile numbers.
const BD_PHONE_REGEX =
  /^(017|013|018|019|014)\d{8}$/;

const ElderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  age: {
    type: Number,
    required: true,
    min: 30,
    max: 120,
  },

  gender: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
    required: true,
    match: [
      BD_PHONE_REGEX,
      "Phone must be an 11-digit number starting with 017, 013, 018, 019, or 014",
    ],
  },

  address: {
    type: AddressSchema,
    required: true,
  },

  bio: {
    type: String,
    default: "",
  },

  medicalConditions: {
    type: [String],
    default: [],
  },

  mobilityNotes: {
    type: String,
    default: "",
  },

  emergencyContact: {
    name: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
      match: [
        BD_PHONE_REGEX,
        "Phone must be an 11-digit number starting with 017, 013, 018, 019, or 014",
      ],
    },

    email: {
      type: String,
      required: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email",
      ],
    },

    relationship: {
      type: String,
      required: true,
    },

    note: {
      type: String,
      default: "",
    },
  },

  secondaryContact: {
    name: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
      validate: {
        validator: (value) =>
          !value || BD_PHONE_REGEX.test(value),
        message:
          "Phone must be an 11-digit number starting with 017, 013, 018, 019, or 014",
      },
    },

    email: {
      type: String,
      default: "",
    },

    relationship: {
      type: String,
      default: "",
    },

    note: {
      type: String,
      default: "",
    },
  },

  familyMemberId: {
    type: String,
    required: true,
  },

  familyMemberEmail: {
    type: String,
    default: "",
  },

  // The checker currently assigned to this elder.
  checkerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Checker",
    default: null,
  },

  status: {
    type: String,
    enum: ["Waiting", "Assigned"],
    default: "Waiting",
  },

  concernStatus: {
    type: String,
    enum: ["Fine", "Concern flagged"],
    default: "Fine",
  },

  visitSchedule: {
    days: {
      type: [String],
      default: [],
    },

    scheduledTime: {
      type: String,
      default: "10:00",
    },

    escalateAfterHours: {
      type: Number,
      default: 4,
    },
  },

  // Subscription is per elder, not per family member.
  subscription: {
    plan: {
      type: String,
      enum: ["free", "premium"],
      default: "free",
    },

    status: {
      type: String,
      enum: [
        "inactive",
        "active",
        "expired",
        "cancelled",
      ],
      default: "inactive",
    },

    currentPeriodEnd: {
      type: Date,
      default: null,
    },

    activatedAt: {
      type: Date,
      default: null,
    },

    lastPaymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubscriptionPayment",
      default: null,
    },
  },

  // Allows an authorized checker to manually override
  // the calculated AI concern score.
  concernOverride: {
    score: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },

    note: {
      type: String,
      default: "",
    },

    setByCheckerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Checker",
      default: null,
    },

    setAt: {
      type: Date,
      default: null,
    },
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default
  mongoose.models.Elder ||
  mongoose.model("Elder", ElderSchema);