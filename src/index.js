import "./index.css";
import Handler from "./modules/Handler.js";
import Helper from "./modules/Helper.js";

(function initApp() {
  Helper.initializeProjectList();
  Helper.setPageTitle("Inbox", true);
  Handler.globalHandler();
})();
