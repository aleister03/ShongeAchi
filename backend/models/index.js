// Registers every model on the mongoose connection.
//
// A route that calls .populate() needs the TARGET model registered, not just the one
// it queried. Because each Next.js route only imports the models it names directly, a
// populate can hit a model nothing has loaded yet and fail with:
//
//   Schema hasn't been registered for model "Visit"
//
// lib/mongodb.js imports this, so connecting registers everything. Any new model must
// be added here — the merge introduced CheckerRequest, Escalation and Notification,
// which are included below.
import AiAssessment from "./AiAssessment.js";
import Checker from "./Checker.js";
import CheckerRequest from "./CheckerRequest.js";
import Elder from "./Elder.js";
import Escalation from "./Escalation.js";
import Notification from "./Notification.js";
import Payment from "./Payment.js";
import SubscriptionPayment from "./SubscriptionPayment.js";
import User from "./User.js";
import Visit from "./Visit.js";
import VisitReport from "./VisitReport.js";

export {
  AiAssessment, Checker, CheckerRequest, Elder, Escalation, Notification,
  Payment, SubscriptionPayment, User, Visit, VisitReport
};
