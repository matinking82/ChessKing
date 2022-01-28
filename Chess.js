let mainHeight;
let BoardWidth;
let SquareWidth;
let Squares = [0]
let SelectedSquare = null;
let WhitesTurn = true;
let AllowedSquares = []
let BlackLongCastle = true;
let BlackShortCastle = true;
let WhiteLongCastle = true;
let WhiteShortCastle = true;
let EnPassantSquare = null;

$(document).ready(async function () {
    mainHeight = $(document).innerHeight();
    BoardWidth = mainHeight * 0.9;
    SquareWidth = BoardWidth / 8;

    $(".ChessBoard").css({
        "width": ('%spx', BoardWidth),
        "height": ('%spx', BoardWidth)
    })

    await CreateBoard();
    await SetPieces();

});

async function SetPieces() {
    //White Pieces
    ChangeSquareImage(Squares[1][2], 1);
    ChangeSquareImage(Squares[2][2], 1);
    ChangeSquareImage(Squares[3][2], 1);
    ChangeSquareImage(Squares[4][2], 1);
    ChangeSquareImage(Squares[5][2], 1);
    ChangeSquareImage(Squares[6][2], 1);
    ChangeSquareImage(Squares[7][2], 1);
    ChangeSquareImage(Squares[8][2], 1);
    ChangeSquareImage(Squares[1][1], 4);
    ChangeSquareImage(Squares[8][1], 4);
    ChangeSquareImage(Squares[3][1], 3);
    ChangeSquareImage(Squares[6][1], 3);
    ChangeSquareImage(Squares[2][1], 2);
    ChangeSquareImage(Squares[7][1], 2);
    ChangeSquareImage(Squares[5][1], 5);
    ChangeSquareImage(Squares[4][1], 6);



    //Black Pieces
    ChangeSquareImage(Squares[1][7], 7);
    ChangeSquareImage(Squares[2][7], 7);
    ChangeSquareImage(Squares[3][7], 7);
    ChangeSquareImage(Squares[4][7], 7);
    ChangeSquareImage(Squares[5][7], 7);
    ChangeSquareImage(Squares[6][7], 7);
    ChangeSquareImage(Squares[7][7], 7);
    ChangeSquareImage(Squares[8][7], 7);
    ChangeSquareImage(Squares[1][8], 10);
    ChangeSquareImage(Squares[8][8], 10);
    ChangeSquareImage(Squares[3][8], 9);
    ChangeSquareImage(Squares[6][8], 9);
    ChangeSquareImage(Squares[2][8], 8);
    ChangeSquareImage(Squares[7][8], 8);
    ChangeSquareImage(Squares[5][8], 11);
    ChangeSquareImage(Squares[4][8], 12);
}

async function CreateBoard() {
    let Color1 = false;
    for (let f = 1; f <= 8; f++) {
        let file = [0];
        for (let n = 1; n <= 8; n++) {
            let square = document.createElement("div");

            $(square)
                .attr({
                    "file": f,
                    "number": n
                })
                .css({
                    "width": ("%spx", SquareWidth),
                    "height": ("%spx", SquareWidth),
                    "left": (f - 1) * SquareWidth,
                    "top": SquareWidth * (8 - n)
                }).addClass("ChessSquare")
                .click(async function () {
                    await clickSquare(this);
                });

            if (Color1) {
                $(square).addClass("SquareColor1");
            } else {
                $(square).addClass("SquareColor2");
            }

            Color1 = !Color1;
            $(".ChessBoard").append(square);

            file.push(square);
        }
        Color1 = !Color1;
        Squares.push(file);
    }
}

async function clickSquare(square) {
    if (SelectedSquare === null) {
        if ($(square).hasClass('ChessSquareFull')) {
            if (IsWhite(square) === WhitesTurn) {
                SelectSquare(square);
            }
        }
    } else {
        let squareToMove = SelectedSquare;
        if (square != squareToMove) {
            let IsSuccess = await MovePiece(squareToMove, square);
            if (!IsSuccess) {
                return;
            }
            //await FlipBoard();
        }
        UnSelectSquare(squareToMove);
        SelectedSquare = null;
    }
}

function IsFriend(square1, square2) {
    let piece1 = parseInt($(square1).attr('piece'));
    let piece2 = parseInt($(square2).attr('piece'));
    return (piece1 <= 6 && piece2 <= 6) || (piece1 > 6 && piece2 > 6);
}

async function UnSelectSquare(square) {
    $(square).removeClass('SquareSelected');
    AllowedSquares = [];

    $('.AllowedSquare1').removeClass('AllowedSquare1');
    $('.AllowedSquare2').removeClass('AllowedSquare2');
}

async function SelectSquare(square) {
    SelectedSquare = square;
    $(square).addClass('SquareSelected');
    AllowedSquares = await GetAllowedSquares(square);
    for (var i = 0; i < AllowedSquares.length; i++) {
        let item = AllowedSquares[i];

        if (IsFriend(square, item)) {
            continue;
        }
        if ($(item).hasClass('SquareColor1')) {
            $(item).addClass('AllowedSquare1');
        } else {
            $(item).addClass('AllowedSquare2');
        }
    }
}

async function ChangeSquareImage(square, piece) {
    EmptySquare(square);
    let img = document.createElement('img');
    img.src = ("Pieces/" + piece + ".png");
    $(square).append(img)
        .attr("Piece", piece)
        .addClass('ChessSquareFull');
}

async function EmptySquare(square) {

    $(square).text('')
        .removeAttr("piece")
        .removeClass('ChessSquareFull');

}

async function MovePiece(startSquare, endSquare) {
    if (HasPiece(endSquare)) {
        if (IsFriend(startSquare, endSquare)) {
            await UnSelectSquare(startSquare);
            await SelectSquare(endSquare);
            return false;
        }
    }

    if (!AllowedSquares.includes(endSquare)) {
        return false;
    }

    let enPassant = EnPassantSquare;
    EnPassantSquare = null;

    let piece = parseInt($(startSquare).attr('piece'));
    let file = parseInt($(startSquare).attr('file'));
    let endfile = parseInt($(endSquare).attr('file'));

    let number = parseInt($(startSquare).attr('number'));
    let endnumber = parseInt($(endSquare).attr('number'));


    //castling
    if (piece == 5) {

        if (endfile == 7 && WhiteShortCastle) {
            await MovePiece(Squares[8][1], Squares[6][1]);
            ChangeTurn();
        }
        if (endfile == 3 && WhiteLongCastle) {
            await MovePiece(Squares[1][1], Squares[4][1]);
            ChangeTurn();
        }


        WhiteLongCastle = false;
        WhiteShortCastle = false;
    }

    if (piece == 11) {

        if (endfile == 7 && BlackShortCastle) {
            await MovePiece(Squares[8][8], Squares[6][8]);
            ChangeTurn();
        }
        if (endfile == 3 && BlackLongCastle) {
            await MovePiece(Squares[1][8], Squares[4][8]);
            ChangeTurn();
        }

        BlackLongCastle = false;
        BlackShortCastle = false;
    }

    if (piece == 4) {
        if (file == 1) {
            WhiteLongCastle = false;
        }
        if (file == 8) {
            WhiteShortCastle = false;
        }
    }

    if (piece == 10) {
        if (file == 1) {
            BlackLongCastle = false;
        }
        if (file == 8) {
            BlackShortCastle = false;
        }
    }


    //en passant

    if (piece == 1) {
        if (Math.abs(number - endnumber) == 2) {
            EnPassantSquare = Squares[file][number + 1];
        }
        if (endSquare == enPassant) {
            EmptySquare(Squares[endfile][endnumber - 1])
        }
    }
    if (piece == 7) {
        if (Math.abs(number - endnumber) == 2) {
            EnPassantSquare = Squares[file][number - 1];
        }
        if (endSquare == enPassant) {
            EmptySquare(Squares[endfile][endnumber + 1])
        }
    }



    await EmptySquare(startSquare);
    await ChangeSquareImage(endSquare, piece);
    await ChangeTurn()
    return true;
}

async function FlipBoard() {
    if ($('.ChessBoard').hasClass('FlipBoard')) {
        $('.ChessBoard').removeClass('FlipBoard')
    } else {
        $('.ChessBoard').addClass('FlipBoard')
    }
}

function IsWhite(square) {
    let piece = $(square).attr('piece');
    return piece <= 6;
}

function HasPiece(square) {
    return $(square).attr('piece') != null;
}

async function ChangeTurn() {
    WhitesTurn = !WhitesTurn;
}

async function GetAllowedSquares(square) {
    debugger;
    let piece = parseInt($(square).attr('piece'));

    switch (piece) {
        case 1://pawn
            return await PawnAllowedSquares(square);
            break;
        case 2://knight
            return await KnightAllowedSquares(square);
            break;
        case 3://bishap
            return await BishopAllowedSquares(square);
            break;
        case 4://rook
            return await RookAllowedSquares(square);
            break;
        case 5://king
            return await KingAllowedSquares(square);
            break;
        case 6://queen
            return await QueenAllowedSquares(square);
            break;
        case 7://pawn
            return await PawnAllowedSquares(square);
            break;
        case 8://knight
            return await KnightAllowedSquares(square);
            break;
        case 9://bishap
            return await BishopAllowedSquares(square);
            break;
        case 10://rook
            return await RookAllowedSquares(square);
            break;
        case 11://king
            return await KingAllowedSquares(square);
            break;
        case 12://queen
            return await QueenAllowedSquares(square);
            break;


        default:
    }


    return Squares[5];
}

async function PawnAllowedSquares(square) {
    let allowedList = [];
    let file = parseInt($(square).attr('file'));
    let number = parseInt($(square).attr('number'));

    let unit = 1;
    if (!IsWhite(square)) {
        unit = -1;
    }
    if ((IsWhite(square) && number === 2) || (!IsWhite(square) && number === 7)) {
        let sqr = Squares[file][number + 2 * unit];
        if (!HasPiece(sqr)) {
            allowedList.push(sqr);
        }
    }
    for (var i = file - 1; i <= file + 1; i++) {
        if (i < 1 || i > 8) {
            continue;
        }
        let sqr = Squares[i][number + unit];
        if (i == file) {
            if (!HasPiece(sqr)) {
                allowedList.push(sqr);
            }
        } else {
            if (EnPassantSquare == sqr) {
                allowedList.push(sqr);
            }
            else {
                if (HasPiece(sqr)) {
                    if (!IsFriend(square, sqr)) {
                        allowedList.push(sqr);
                    }
                }
            }
        }
    }



    return allowedList;
}

async function KnightAllowedSquares(square) {
    let allowedList = [];
    let file = parseInt($(square).attr('file'));
    let number = parseInt($(square).attr('number'));

    for (var i = file - 2; i <= file + 2; i++) {
        if (i < 1 || i > 8) {
            continue;
        }
        for (var j = number - 2; j <= number + 2; j++) {
            if (j < 1 || j > 8) {
                continue;
            }

            let side1 = Math.abs(i - file)
            let side2 = Math.abs(j - number)

            if (side1 + side2 === 3) {
                let sqr = Squares[i][j];
                if (HasPiece(sqr)) {
                    if (IsFriend(sqr, square)) {
                        continue;
                    }
                }
                allowedList.push(sqr);
            }
        }
    }

    return allowedList;
}

async function BishopAllowedSquares(square) {
    let allowedList = [];
    let temp = [];
    temp.push(await GetDiagonalAllowed(1, 1, square));
    temp.push(await GetDiagonalAllowed(-1, 1, square));
    temp.push(await GetDiagonalAllowed(1, -1, square));
    temp.push(await GetDiagonalAllowed(-1, -1, square));

    for (var i = 0; i < temp.length; i++) {
        let list = temp[i];

        for (var j = 0; j < list.length; j++) {
            let item = list[j];
            allowedList.push(item);
        }
    }

    return allowedList;
}

async function GetDiagonalAllowed(unit1, unit2, square) {
    let allowedList = [];
    let file = parseInt($(square).attr('file'));
    let number = parseInt($(square).attr('number'));

    for (var i = 1; true; i++) {
        let sqrFile = file + (i * unit1);
        let sqrNumber = number + (i * unit2);
        if (sqrFile < 1 || sqrFile > 8 || sqrNumber > 8 || sqrNumber < 1) {
            break;
        }

        let sqr = Squares[sqrFile][sqrNumber];

        if (HasPiece(sqr)) {
            if (!IsFriend(sqr, square)) {
                allowedList.push(sqr)
            }
            break;
        }
        allowedList.push(sqr)
    }

    return allowedList;
}

async function GetVerticalAllowed(square) {
    let allowedList = [];
    let file = parseInt($(square).attr('file'));
    let number = parseInt($(square).attr('number'));

    for (var i = file + 1; true; i++) {
        if (i > 8 || i < 1) {
            break;
        }

        let sqr = Squares[i][number]
        if (HasPiece(sqr)) {
            if (!IsFriend(sqr, square)) {
                allowedList.push(sqr)
            }
            break;
        }
        allowedList.push(sqr)
    }

    for (var i = file - 1; true; i--) {
        if (i > 8 || i < 1) {
            break;
        }

        let sqr = Squares[i][number]
        if (HasPiece(sqr)) {
            if (!IsFriend(sqr, square)) {
                allowedList.push(sqr)
            }
            break;
        }
        allowedList.push(sqr)
    }

    for (var i = number + 1; true; i++) {
        if (i > 8 || i < 1) {
            break;
        }

        let sqr = Squares[file][i]
        if (HasPiece(sqr)) {
            if (!IsFriend(sqr, square)) {
                allowedList.push(sqr)
            }
            break;
        }
        allowedList.push(sqr)
    }

    for (var i = number - 1; true; i--) {
        if (i > 8 || i < 1) {
            break;
        }

        let sqr = Squares[file][i]
        if (HasPiece(sqr)) {
            if (!IsFriend(sqr, square)) {
                allowedList.push(sqr)
            }
            break;
        }
        allowedList.push(sqr)
    }

    return allowedList;
}

async function RookAllowedSquares(square) {
    return await GetVerticalAllowed(square);
}

async function KingAllowedSquares(square) {
    let allowedList = [];
    let file = parseInt($(square).attr('file'));
    let number = parseInt($(square).attr('number'));

    for (var i = file - 1; i <= file + 1; i++) {
        for (var j = number - 1; j <= number + 1; j++) {

            if (i > 8 || i < 1 || j > 8 || j < 1) {
                continue;
            }

            let sqr = Squares[i][j];

            if (HasPiece(sqr)) {
                if (IsFriend(sqr, square)) {
                    continue;
                }
            }
            allowedList.push(sqr)
        }
    }

    if (IsWhite(square)) {
        if (WhiteShortCastle) {
            if (!HasPiece(Squares[6][1]) && !HasPiece(Squares[7][1])) {
                allowedList.push(Squares[7][1])
            }
        }
        if (WhiteLongCastle) {
            if (!HasPiece(Squares[2][1]) && !HasPiece(Squares[3][1]) && !HasPiece(Squares[4][1])) {
                allowedList.push(Squares[3][1])
            }
        }
    } else {
        debugger;
        if (BlackShortCastle) {
            if (!HasPiece(Squares[6][8]) && !HasPiece(Squares[7][8])) {
                allowedList.push(Squares[7][8])
            }
        }
        if (BlackLongCastle) {
            if (!HasPiece(Squares[2][8]) && !HasPiece(Squares[3][8]) && !HasPiece(Squares[4][8])) {
                allowedList.push(Squares[3][8])
            }
        }
    }

    return allowedList;
}

async function QueenAllowedSquares(square) {
    let allowedList = [];
    let temp = [];
    temp.push(await GetDiagonalAllowed(1, 1, square));
    temp.push(await GetDiagonalAllowed(-1, 1, square));
    temp.push(await GetDiagonalAllowed(1, -1, square));
    temp.push(await GetDiagonalAllowed(-1, -1, square));
    temp.push(await GetVerticalAllowed(square));

    for (var i = 0; i < temp.length; i++) {
        let list = temp[i];

        for (var j = 0; j < list.length; j++) {
            let item = list[j];
            allowedList.push(item);
        }
    }

    return allowedList;
}