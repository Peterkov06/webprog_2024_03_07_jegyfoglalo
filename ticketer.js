let seats = [];
let cart = [];
let reservedSeats = [];



GenerateSeats(50);
LoadSeats();
GenerateBtns();
CalcPrice();

function GenerateSeats(seatsInRow)
{
  for (let y = 0; y < seatsInRow; y++) {
    let row = [];
    for (let x = 0; x < seatsInRow; x++) {
      if (x === 24 || y === 24 || x === 25 || y === 25)
      {
        row[x] = 4;
        row[x + 1] = 4;
        x++;
      }
      else
      {
        row[x] = 1;
      }
    }
    seats.push(row);
  }
}

function GenerateBtns()
{
  document.getElementsByClassName("btns")[0].innerHTML = "";
  let table = document.createElement("table");
  for (let y = 0; y < seats.length; y++) {
    let row = document.createElement("tr");
    for (let x = 0; x < seats[y].length; x++) {
      let currSeatBtn = document.createElement("input");
      currSeatBtn.setAttribute("type" ,"button");
      currSeatBtn.setAttribute("value", `${seats[y][x]}`);
      if (seats[y][x] === 1)
      {
        currSeatBtn.classList += "availableSeat";
        currSeatBtn.onclick = function() { seats[y][x] = 2; cart.push([y,x]); CalcPrice(); GenerateBtns();};
      }
      else if (seats[y][x] === 2)
      {
        currSeatBtn.classList += "underReserve";
        const element = [y,x];
        let index = cart.findIndex(item => item === element);
        currSeatBtn.onclick = function() { seats[y][x] = 1; cart.splice(index,1);  CalcPrice(); GenerateBtns();};
      }
      else if (seats[y][x] === 3)
      {
        currSeatBtn.classList += "reserved";
        currSeatBtn.setAttribute("disabled", "true");
      }
      else if (seats[y][x] === 4)
      {
        currSeatBtn.setAttribute("disabled", "true");
      }
      row.appendChild(currSeatBtn);
    }
    table.appendChild(row);
  }

  document.getElementsByClassName("btns")[0].appendChild(table);
}

function CalcPrice()
{
  let price = 0;
  cart.forEach(coord => {
    if (coord[0] < 25)
    {
      price += 5000;
    }
    else
    {
      price += 3500;
    }
  });
  document.getElementsByClassName("price")[0].innerText = `${price}`;
}

function Pay()
{
  for (let y = 0; y < cart.length; y++) {
    seats[cart[y][0]][cart[y][1]] = 3;
    reservedSeats.push([cart[y][0],cart[y][1]]);
  }
  WriteToCookies(reservedSeats, "seats", 60);
  cart = [];
  CalcPrice();
  GenerateBtns();
}

function WriteToCookies(itemToWrite, name, exdays)
{
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  const jsString = JSON.stringify(itemToWrite);
  document.cookie = `${name}=${jsString}; path=/; ${expires}`
}

function FindCookie(name)
{
  const cookieName = name + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  let cookieList = decodedCookie.split(";");

  for (let index = 0; index < cookieList.length; index++) {
    let current = cookieList[index];
    while (current.charAt(0) == ' ') {
      current == current.substring(1)
    }
    if (current.indexOf(cookieName) == 0)
    {
      return current.substring(cookieName.length, current.length);
    }
  }
  return "";
}

function LoadSeats()
{
  let seatCookie = FindCookie("seats");
  if(seatCookie != "")
  {
    reservedSeats = JSON.parse(seatCookie);
    for (let index = 0; index < reservedSeats.length; index++) {
      seats[reservedSeats[index][0]][reservedSeats[index][1]] = 3;
    }
  }
}