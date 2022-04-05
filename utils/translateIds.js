module.exports = (from, inp) => {
  if (from == 'id') {
    switch (inp) {
      case "624558d1a263f17689cdc5bc":
        return "TEXT";
      case "624558d1a263f17689cdc5bd":
        return "CHOICE";
      case "624558d1a263f17689cdc5be":
        return "MULTI-SELECT";
      case "623cc24a8b7ab06011bd1e5f":
        return "MEMBER";
      case "623cc24a8b7ab06011bd1e60":
        return "OWNER";
      case "623cc24a8b7ab06011bd1e61":
        return "ADMIN";
      case "623cc24a8b7ab06011bd1e62":
        return "SUPER";
      case "623d73a051e8bcb894b3f7df":
        return "FREE TRAIL";
      case "623d73a051e8bcb894b3f7e0":
        return "UNLIMITED";      
      default:
        return false;
    }
  } else {
    switch (inp) {
      case "TEXT":
        return "624558d1a263f17689cdc5bc";
      case "CHOICE":
        return "624558d1a263f17689cdc5bd";
      case "MULTI-SELECT":
        return "624558d1a263f17689cdc5be";
      case "MEMBER":
        return "623cc24a8b7ab06011bd1e5f";
      case "OWNER":
        return "623cc24a8b7ab06011bd1e60";
      case "ADMIN":
        return "623cc24a8b7ab06011bd1e61";
      case "SUPER":
        return "623cc24a8b7ab06011bd1e62";
      case "FREE TRAIL":
        return "623d73a051e8bcb894b3f7df";
      case "UNLIMITED":
        return "623d73a051e8bcb894b3f7e0";      
      default:
        return false;
    }
  }
}