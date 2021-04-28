import { store } from "../redux/storeConfig/store";

export const getImagePath = (path) => {
  var pattern = new RegExp(/^(ftp|http|https):\/\/[^ "]+$/);
  if (pattern.test(path) || path.indexOf("blob:") > -1) {
    return path;
  } else {
    return process.env.REACT_APP_API_RESOURCE_URL + path;
  }
};

// accepts permission name and scope, checks whether user is allowed to view certain ui component
export const isAllowed = (name, scope) => {
  if (name && scope) {
    const {
      auth: {
        user: { permissions, role },
      },
    } = store.getState();
    if (role["id"] === 1) {
      return true;
    } else {
      const permissionRow = permissions.filter(
        (item) => item.permission_detail.name === name && item[scope]
      );
      return permissionRow.length > 0;
    }
  }
  return false;
};

export const amountToWords = (price) => {
  var sglDigit = [
      "Zero",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
    ],
    dblDigit = [
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ],
    tensPlace = [
      "",
      "Ten",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ],
    handle_tens = function (dgt, prevDgt) {
      return 0 === dgt
        ? ""
        : " " + (1 === dgt ? dblDigit[prevDgt] : tensPlace[dgt]);
    },
    handle_utlc = function (dgt, nxtDgt, denom) {
      return (
        (0 !== dgt && 1 !== nxtDgt ? " " + sglDigit[dgt] : "") +
        (0 !== nxtDgt || dgt > 0 ? " " + denom : "")
      );
    };

  var str = "",
    digitIdx = 0,
    digit = 0,
    nxtDigit = 0,
    words = [];
  if (((price += ""), isNaN(parseInt(price)))) str = "";
  else if (parseInt(price) > 0 && price.length <= 10) {
    for (digitIdx = price.length - 1; digitIdx >= 0; digitIdx--)
      switch (
        ((digit = price[digitIdx] - 0),
        (nxtDigit = digitIdx > 0 ? price[digitIdx - 1] - 0 : 0),
        price.length - digitIdx - 1)
      ) {
        case 0:
          words.push(handle_utlc(digit, nxtDigit, ""));
          break;
        case 1:
          words.push(handle_tens(digit, price[digitIdx + 1]));
          break;
        case 2:
          words.push(
            0 !== digit
              ? " " +
                  sglDigit[digit] +
                  " Hundred" +
                  (0 !== price[digitIdx + 1] && 0 !== +price[digitIdx + 2]
                    ? " and"
                    : "")
              : ""
          );
          break;
        case 3:
          words.push(handle_utlc(digit, nxtDigit, "Thousand"));
          break;
        case 4:
          words.push(handle_tens(digit, price[digitIdx + 1]));
          break;
        case 5:
          words.push(handle_utlc(digit, nxtDigit, "Lakh"));
          break;
        case 6:
          words.push(handle_tens(digit, price[digitIdx + 1]));
          break;
        case 7:
          words.push(handle_utlc(digit, nxtDigit, "Crore"));
          break;
        case 8:
          words.push(handle_tens(digit, price[digitIdx + 1]));
          break;
        case 9:
          words.push(
            0 !== digit
              ? " " +
                  sglDigit[digit] +
                  " Hundred" +
                  (0 !== price[digitIdx + 1] || 0 !== price[digitIdx + 2]
                    ? " and"
                    : " Crore")
              : ""
          );
          break;
        default:
      }
    str = words.reverse().join("");
  } else str = "";
  return str;
};
