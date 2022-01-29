let mainHeight;
let mainWidth;
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
let WhiteScore = 0;
let BlackScore = 0;
let LastMoveStartSquare = null;
let LastMoveEndSquare = null;


$(document).ready(async function () {
    mainHeight = $(document).innerHeight();
    mainWidth = $(document).innerWidth();
    if (mainHeight > mainWidth) {
        BoardWidth = mainWidth * 0.9;
    } else {
        BoardWidth = mainHeight * 0.7;
    }
    SquareWidth = BoardWidth / 8;

    $(".ChessBoard").css({
        "width": ('%spx', BoardWidth),
        "height": ('%spx', BoardWidth)
    })

    $('.menu').css('width', ('%spx', (BoardWidth - (2 * parseInt($('.menu').css('padding')))) / 1.5));
    $('#ScoreBoard').css('width', ('%spx', BoardWidth));
    $('#ScoreBoard').css('height', ('%spx', BoardWidth / 5));
    $('#FlipBoard').click(FlipBoard);
    $('#RestartGame').click(RestartGame);
    debugger;
    await StartGame();

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
    await ClearBoard();
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

    RemoveHighLightedSquares();
}

async function RemoveHighLightedSquares() {
    $('.AllowedSquare1').removeClass('AllowedSquare1');
    $('.AllowedSquare2').removeClass('AllowedSquare2');
}

async function HighLightSquare(square) {
    if ($(square).hasClass('SquareColor1')) {
        $(square).addClass('AllowedSquare1');
    } else {
        $(square).addClass('AllowedSquare2');
    }
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

        HighLightSquare(item);
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
    debugger;
    let isCheck = await IsCheck(WhitesTurn);
    if (isCheck) {
        Check(WhitesTurn);
    }

    await ShowLastMove(startSquare, endSquare);
    return true;
}

async function Check(White = true) {
    debugger;
    alert("Check!!");
    if (!(await HasMoves(White))) {
        await Mate(White);
    }
}

async function HasMoves(White = true) {
    let Pieces = await GetPieces(White);

    for (var i = 0; i < Pieces.length; i++) {
        let piece = Pieces[i];
        let allowedSquares = await GetAllowedSquares(piece);

        if (allowedSquares.length !== 0) {
            return true;
        }
    }

    return false;
}

async function Mate(White = true) {
    alert('Mate!!!');
    await AddScore(!White)
}

async function AddScore(White = true) {
    debugger;
    if (White) {
        WhiteScore++;
        $('#WhiteScoreNumber').text(WhiteScore);

    } else {
        BlackScore++;
        $('#BlackScoreNumber').text(BlackScore);
    }
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
    let piece = parseInt($(square).attr('piece'));

    let returnSquares = [];

    switch (piece) {
        case 1://pawn
            returnSquares = await PawnAllowedSquares(square);
            break;
        case 2://knight
            returnSquares = await KnightAllowedSquares(square);
            break;
        case 3://bishap
            returnSquares = await BishopAllowedSquares(square);
            break;
        case 4://rook
            returnSquares = await RookAllowedSquares(square);
            break;
        case 5://king
            returnSquares = await KingAllowedSquares(square);
            break;
        case 6://queen
            returnSquares = await QueenAllowedSquares(square);
            break;
        case 7://pawn
            returnSquares = await PawnAllowedSquares(square);
            break;
        case 8://knight
            returnSquares = await KnightAllowedSquares(square);
            break;
        case 9://bishap
            returnSquares = await BishopAllowedSquares(square);
            break;
        case 10://rook
            returnSquares = await RookAllowedSquares(square);
            break;
        case 11://king
            returnSquares = await KingAllowedSquares(square);
            break;
        case 12://queen
            returnSquares = await QueenAllowedSquares(square);
            break;
    }


    returnSquares = CheckPinAndReturn(square, returnSquares);

    return returnSquares;
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

async function GetPawnAtackedSquares(square) {
    let AtackedSquareList = [];
    let file = parseInt($(square).attr('file'));
    let number = parseInt($(square).attr('number'));
    let unit = 1;
    if (!IsWhite(square)) {
        unit = -1;
    }

    for (var i = file - 1; i <= file + 1; i++) {
        if (i < 1 || i > 8) {
            continue;
        }
        let sqr = Squares[i][number + unit];
        if (i == file) {
            continue;
        } else {
            AtackedSquareList.push(sqr);
        }
    }
    return AtackedSquareList;
}

async function KnightAllowedSquares(square, atack = false) {
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
                        if (!atack) {
                            continue;
                        }
                    }
                }
                allowedList.push(sqr);
            }
        }
    }

    return allowedList;
}

async function BishopAllowedSquares(square, atack = false) {
    let allowedList = [];
    let temp = [];
    temp.push(await GetDiagonalAllowed(1, 1, square, atack));
    temp.push(await GetDiagonalAllowed(-1, 1, square, atack));
    temp.push(await GetDiagonalAllowed(1, -1, square, atack));
    temp.push(await GetDiagonalAllowed(-1, -1, square, atack));

    for (var i = 0; i < temp.length; i++) {
        let list = temp[i];

        for (var j = 0; j < list.length; j++) {
            let item = list[j];
            allowedList.push(item);
        }
    }

    return allowedList;
}

async function GetDiagonalAllowed(unit1, unit2, square, atack = false) {
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
                allowedList.push(sqr);
            } else if (atack) {
                allowedList.push(sqr);
            }
            if (atack) {
                let pieceId = GetPieceId(sqr);
                if (!((pieceId === 5 && !IsWhite(square)) || (pieceId === 11 && IsWhite(square)))) {
                    break;
                }
            } else {
                break;
            }
        }
        allowedList.push(sqr)
    }

    return allowedList;
}

async function GetVerticalAllowed(square, atack = false) {
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
            } else if (atack) {
                allowedList.push(sqr);
            }
            if (atack) {
                let pieceId = GetPieceId(sqr);
                if (!((pieceId === 5 && !IsWhite(square)) || (pieceId === 11 && IsWhite(square)))) {
                    break;
                }
            } else {
                break;
            }
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
            } else if (atack) {
                allowedList.push(sqr);
            }
            if (atack) {
                let pieceId = GetPieceId(sqr);
                if (!((pieceId === 5 && !IsWhite(square)) || (pieceId === 11 && IsWhite(square)))) {
                    break;
                }
            } else {
                break;
            }
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
            } else if (atack) {
                allowedList.push(sqr);
            }
            if (atack) {
                let pieceId = GetPieceId(sqr);
                if (!((pieceId === 5 && !IsWhite(square)) || (pieceId === 11 && IsWhite(square)))) {
                    break;
                }
            } else {
                break;
            }
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
            } else if (atack) {
                allowedList.push(sqr);
            }
            if (atack) {
                let pieceId = GetPieceId(sqr);
                if (!((pieceId === 5 && !IsWhite(square)) || (pieceId === 11 && IsWhite(square)))) {
                    break;
                }
            } else {
                break;
            }
        }
        allowedList.push(sqr)
    }

    return allowedList;
}

async function RookAllowedSquares(square, atack = false) {
    return await GetVerticalAllowed(square, atack);
}

async function KingAllowedSquares(square) {
    let allowedList = [];
    let file = parseInt($(square).attr('file'));
    let number = parseInt($(square).attr('number'));

    let enemyAtackedSquares;
    if (IsWhite(square)) {
        enemyAtackedSquares = await GetAtackedSquares(false);
    } else {
        enemyAtackedSquares = await GetAtackedSquares(true);
    }

    for (var i = file - 1; i <= file + 1; i++) {
        for (var j = number - 1; j <= number + 1; j++) {

            if (i > 8 || i < 1 || j > 8 || j < 1) {
                continue;
            }

            let sqr = Squares[i][j];
            if (enemyAtackedSquares.includes(sqr)) {
                continue;
            }
            if (HasPiece(sqr)) {
                if (IsFriend(sqr, square)) {
                    continue;
                }
            }
            allowedList.push(sqr)
        }
    }

    //castling
    if (IsWhite(square)) {
        if (!(await IsCheck(true))) {
            if (WhiteShortCastle) {
                if (!HasPiece(Squares[6][1]) && !HasPiece(Squares[7][1])
                    && !enemyAtackedSquares.includes(Squares[6][1])
                    && !enemyAtackedSquares.includes(Squares[7][1])
                    && !enemyAtackedSquares.includes(Squares[8][1])) {
                    allowedList.push(Squares[7][1])
                }
            }
            if (WhiteLongCastle) {
                if (!HasPiece(Squares[2][1]) && !HasPiece(Squares[3][1]) && !HasPiece(Squares[4][1])
                    && !enemyAtackedSquares.includes(Squares[1][1])
                    && !enemyAtackedSquares.includes(Squares[2][1])
                    && !enemyAtackedSquares.includes(Squares[3][1])
                    && !enemyAtackedSquares.includes(Squares[4][1])) {
                    allowedList.push(Squares[3][1])
                }
            }
        }
    } else {
        if (!(await IsCheck(false))) {
            if (BlackShortCastle) {
                if (!HasPiece(Squares[6][8]) && !HasPiece(Squares[7][8])
                    && !enemyAtackedSquares.includes(Squares[6][8])
                    && !enemyAtackedSquares.includes(Squares[7][8])
                    && !enemyAtackedSquares.includes(Squares[8][8])) {
                    allowedList.push(Squares[7][8])
                }
            }
            if (BlackLongCastle) {
                if (!HasPiece(Squares[2][8]) && !HasPiece(Squares[3][8]) && !HasPiece(Squares[4][8])
                    && !enemyAtackedSquares.includes(Squares[1][8])
                    && !enemyAtackedSquares.includes(Squares[2][8])
                    && !enemyAtackedSquares.includes(Squares[3][8])
                    && !enemyAtackedSquares.includes(Squares[4][8])) {
                    allowedList.push(Squares[3][8])
                }
            }
        }
    }

    return allowedList;
}

async function GetKingAtackedSquares(square) {

    let allowedList = [];
    let file = parseInt($(square).attr('file'));
    let number = parseInt($(square).attr('number'));

    for (var i = file - 1; i <= file + 1; i++) {
        for (var j = number - 1; j <= number + 1; j++) {

            if (i > 8 || i < 1 || j > 8 || j < 1) {
                continue;
            }

            let sqr = Squares[i][j];

            allowedList.push(sqr)
        }
    }

    return allowedList;

}

async function QueenAllowedSquares(square, atack = false) {
    let allowedList = [];
    let temp = [];
    temp.push(await GetDiagonalAllowed(1, 1, square, atack));
    temp.push(await GetDiagonalAllowed(-1, 1, square, atack));
    temp.push(await GetDiagonalAllowed(1, -1, square, atack));
    temp.push(await GetDiagonalAllowed(-1, -1, square, atack));
    temp.push(await GetVerticalAllowed(square, atack));

    for (var i = 0; i < temp.length; i++) {
        let list = temp[i];

        for (var j = 0; j < list.length; j++) {
            let item = list[j];
            allowedList.push(item);
        }
    }

    return allowedList;
}

function GetPieceId(square) {
    return parseInt($(square).attr('piece'));
}

async function GetPieces(White = true) {
    let pieces = [];
    let allPieces = $('.ChessSquareFull').toArray();

    for (var i = 0; i < allPieces.length; i++) {
        let item = allPieces[i];

        if (IsWhite(item) === White) {
            pieces.push(item);
        }
    }

    return pieces;
}

async function GetAtackedSquares(White = true) {
    let pieces = await GetPieces(White);
    let atackedList = [];

    for (var i = 0; i < pieces.length; i++) {
        let item = pieces[i];
        let pieceId = GetPieceId(item);
        let atacked = [];
        if (pieceId == 1 || pieceId == 7) {
            atacked = await GetPawnAtackedSquares(item);
        } else if (pieceId == 2 || pieceId == 8) {
            atacked = await KnightAllowedSquares(item, true);
        } else if (pieceId == 3 || pieceId == 9) {
            atacked = await BishopAllowedSquares(item, true);
        } else if (pieceId == 4 || pieceId == 10) {
            atacked = await RookAllowedSquares(item, true);
        } else if (pieceId == 5 || pieceId == 11) {
            atacked = await GetKingAtackedSquares(item);
        } else if (pieceId == 6 || pieceId == 12) {
            atacked = await QueenAllowedSquares(item, true);
        }

        for (var j = 0; j < atacked.length; j++) {
            let sqr = atacked[j];

            if (!atackedList.includes(sqr)) {
                atackedList.push(sqr);
            }
        }
    }

    return atackedList;
}

async function IsCheck(White = true) {
    let atackedSquares = await GetAtackedSquares(!White);

    let kingId = 5;
    if (!White) {
        kingId = 11;
    }

    for (var i = 0; i < atackedSquares.length; i++) {
        let square = atackedSquares[i];

        if (HasPiece(square)) {

            let pieceId = GetPieceId(square);

            if (pieceId === kingId) {
                return true;
            }
        }
    }
    return false;
}

async function CheckPinAndReturn(square, allowedSquares) {
    let returnSquares = [];
    let pieceId = await GetPieceId(square);

    let isWhite = IsWhite(square);

    $(square)
        .removeAttr("piece")
        .removeClass('ChessSquareFull');

    for (var i = 0; i < allowedSquares.length; i++) {


        let sqr = allowedSquares[i];

        let isCheck;

        if (HasPiece(sqr)) {

            let sqrPieceId = GetPieceId(sqr);
            $(sqr)
                .attr('piece', pieceId);
            isCheck = await IsCheck(isWhite);
            $(sqr)
                .attr("piece", sqrPieceId);

        } else {

            $(sqr).attr('piece', pieceId)
                .addClass('ChessSquareFull');

            isCheck = await IsCheck(isWhite);
            $(sqr)
                .removeAttr("piece")
                .removeClass('ChessSquareFull');
        }

        if (isCheck) {
            continue;
        }
        returnSquares.push(sqr);
    }

    $(square).attr('piece', pieceId)
        .addClass('ChessSquareFull');

    return returnSquares;
}

async function ClearBoard() {
    $(".ChessBoard").text('');
    Squares = [0];
}

async function RestartGame() {
    if (SelectedSquare !== null) {
        await UnSelectSquare(SelectedSquare);
        SelectedSquare = null;
    }
    WhitesTurn = true;
    AllowedSquares = []
    BlackLongCastle = true;
    BlackShortCastle = true;
    WhiteLongCastle = true;
    WhiteShortCastle = true;
    EnPassantSquare = null;
    LastMoveStartSquare = null;
    LastMoveEndSquare = null;
    Squares = [0];

    await StartGame()

    console.log(WhitesTurn);
}

async function StartGame() {
    await CreateBoard();
    await SetPieces();
}

async function ShowLastMove(startSquare, endSquare) {
    if (LastMoveStartSquare !== null) {
        $(LastMoveStartSquare).removeClass('LastMoveSquare');
    }
    if (LastMoveEndSquare !== null) {
        $(LastMoveEndSquare).removeClass('LastMoveSquare');
    }

    LastMoveStartSquare = startSquare;
    LastMoveEndSquare = endSquare;

    $(LastMoveEndSquare).addClass('LastMoveSquare');
    $(LastMoveStartSquare).addClass('LastMoveSquare');
}