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
const FileNames = [0, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
const PieceNames = [0, '', 'N', 'B', 'R', 'K', 'Q', '', 'N', 'B', 'R', 'K', 'Q']
const FENPieceNames = [0, 'P', 'N', 'B', 'R', 'K', 'Q', 'p', 'n', 'b', 'r', 'k', 'q']
let PGN = [];
let PGNCopy = [];
let PGNAt = 0;


$(document).ready(function () {
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
    $('#PgnBoard').css('width', ('%spx', BoardWidth));
    $('.FENBoard').css('width', ('%spx', BoardWidth));
    $('#FlipBoard').click(FlipBoard);
    $('#RestartGame').click(RestartGame);
    $('#ShowPgnModal').click(ShowPgnModal);
    $('#btnInsertPgn').click(btnInsertPgnClicked);
    $("#btnCopyPgn").click(btnCopyPgnClicked);
    $('#btnInsertFEN').click(btnInsertFENClicked);
    $('.Controls').css('width', ('%spx', BoardWidth));
    $('.Controls').css('height', ('%spx', SquareWidth * 0.8));
    $('#btnPrevMove').click(PreviousMove);
    $('#btnNextMove').click(NextMove);

    $('#txtNextMovePGN').on('keypress', function (e) {
        if (e.which === 13) {
            txtNextMovePGNEnter();
        }
    });;
    StartGame();

});

function txtNextMovePGNEnter() {

    let pgnMove = $('#txtNextMovePGN').val();
    $('#txtNextMovePGN').val('');

    MoveWithPGN(pgnMove, WhitesTurn, true);
    UpdateFENBoard();
}

function SetPieces() {
    let startFEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq';

    CreateBoardWithFEN(startFEN);

    ////White Pieces
    //ChangeSquareImage(Squares[1][2], 1);
    //ChangeSquareImage(Squares[2][2], 1);
    //ChangeSquareImage(Squares[3][2], 1);
    //ChangeSquareImage(Squares[4][2], 1);
    //ChangeSquareImage(Squares[5][2], 1);
    //ChangeSquareImage(Squares[6][2], 1);
    //ChangeSquareImage(Squares[7][2], 1);
    //ChangeSquareImage(Squares[8][2], 1);
    //ChangeSquareImage(Squares[1][1], 4);
    //ChangeSquareImage(Squares[8][1], 4);
    //ChangeSquareImage(Squares[3][1], 3);
    //ChangeSquareImage(Squares[6][1], 3);
    //ChangeSquareImage(Squares[2][1], 2);
    //ChangeSquareImage(Squares[7][1], 2);
    //ChangeSquareImage(Squares[5][1], 5);
    //ChangeSquareImage(Squares[4][1], 6);



    ////Black Pieces
    //ChangeSquareImage(Squares[1][7], 7);
    //ChangeSquareImage(Squares[2][7], 7);
    //ChangeSquareImage(Squares[3][7], 7);
    //ChangeSquareImage(Squares[4][7], 7);
    //ChangeSquareImage(Squares[5][7], 7);
    //ChangeSquareImage(Squares[6][7], 7);
    //ChangeSquareImage(Squares[7][7], 7);
    //ChangeSquareImage(Squares[8][7], 7);
    //ChangeSquareImage(Squares[1][8], 10);
    //ChangeSquareImage(Squares[8][8], 10);
    //ChangeSquareImage(Squares[3][8], 9);
    //ChangeSquareImage(Squares[6][8], 9);
    //ChangeSquareImage(Squares[2][8], 8);
    //ChangeSquareImage(Squares[7][8], 8);
    //ChangeSquareImage(Squares[5][8], 11);
    //ChangeSquareImage(Squares[4][8], 12);
}

function CreateBoard() {
    ClearBoard();
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
                .click(function () {
                    clickSquare(this);
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

function clickSquare(square) {
    if (SelectedSquare === null) {
        if ($(square).hasClass('ChessSquareFull')) {
            if (IsWhite(square) === WhitesTurn) {
                SelectSquare(square);
            }
        }
    } else {
        let squareToMove = SelectedSquare;
        if (square != squareToMove) {
            let IsSuccess = MovePiece(squareToMove, square, false, null, true, true);
            if (!IsSuccess) {
                return;
            }
            // FlipBoard();
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

function UnSelectSquare(square) {
    $(square).removeClass('SquareSelected');
    AllowedSquares = [];

    RemoveHighLightedSquares();
}

function RemoveHighLightedSquares() {
    $('.AllowedSquare1').removeClass('AllowedSquare1');
    $('.AllowedSquare2').removeClass('AllowedSquare2');
}

function HighLightSquare(square) {
    if ($(square).hasClass('SquareColor1')) {
        $(square).addClass('AllowedSquare1');
    } else {
        $(square).addClass('AllowedSquare2');
    }
}

function SelectSquare(square) {
    SelectedSquare = square;
    $(square).addClass('SquareSelected');
    AllowedSquares = GetAllowedSquares(square);
    for (var i = 0; i < AllowedSquares.length; i++) {
        let item = AllowedSquares[i];

        if (IsFriend(square, item)) {
            continue;
        }

        HighLightSquare(item);
    }
}

function ChangeSquareImage(square, piece) {
    EmptySquare(square);
    let img = document.createElement('img');
    img.src = ("Pieces/" + piece + ".png");
    $(square).append(img)
        .attr("Piece", piece)
        .addClass('ChessSquareFull');
}

function EmptySquare(square) {

    $(square).text('')
        .removeAttr("piece")
        .removeClass('ChessSquareFull');

}

function MovePiece(startSquare, endSquare, castle = false, promote = null, UpdateFEN = true, IsManualMove = false) {
    if (HasPiece(endSquare)) {
        if (IsFriend(startSquare, endSquare)) {
            UnSelectSquare(startSquare);
            SelectSquare(endSquare);
            return false;
        }
    }

    if (!(CanMove(startSquare, endSquare))) {
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
            MovePiece(Squares[8][1], Squares[6][1], true, null, false);
            ChangeTurn();
        }
        if (endfile == 3 && WhiteLongCastle) {
            MovePiece(Squares[1][1], Squares[4][1], true, null, false);
            ChangeTurn();
        }


        WhiteLongCastle = false;
        WhiteShortCastle = false;
    }

    if (piece == 11) {

        if (endfile == 7 && BlackShortCastle) {
            MovePiece(Squares[8][8], Squares[6][8], true);
            ChangeTurn();
        }
        if (endfile == 3 && BlackLongCastle) {
            MovePiece(Squares[1][8], Squares[4][8], true);
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
    let takes = false;

    if (HasPiece(endSquare)) {
        takes = true;
    }

    if (piece == 1) {
        if (Math.abs(number - endnumber) == 2) {
            EnPassantSquare = Squares[file][number + 1];
        }
        if (endSquare == enPassant) {
            EmptySquare(Squares[endfile][endnumber - 1])
            takes = true;
        }
    }
    if (piece == 7) {
        if (Math.abs(number - endnumber) == 2) {
            EnPassantSquare = Squares[file][number - 1];
        }
        if (endSquare == enPassant) {
            EmptySquare(Squares[endfile][endnumber + 1])
            takes = true;
        }

    }


    EmptySquare(startSquare);
    ChangeSquareImage(endSquare, piece);
    ChangeTurn()

    //Promote
    let promoteName = null;
    if ((piece == 1 && endnumber == 8) || (piece == 7 && endnumber == 1)) {

        let promoteTo;

        if (promote !== null) {
            promoteTo = promote;
        } else {
            if (IsWhite(endSquare)) {
                promoteTo = 6;
            } else {
                promoteTo = 12;
            }
        }

        Promote(endSquare, promoteTo);
        promoteName = PieceNames[promoteTo];
    }

    if (!castle) {
        AddPGN(startSquare, endSquare, takes, promoteName);
    }
    let isCheck = IsCheck(WhitesTurn);
    if (isCheck) {
        Check(WhitesTurn);
    } else {
        // PlayAudio('SFX/MovePiece.wav');
    }

    ShowLastMove(startSquare, endSquare);
    if (UpdateFEN) {
        UpdateFENBoard();
    }

    if (IsManualMove) {
        ResetPGNCopy();
    }

    return true;
}

function Promote(square, PromoteId) {
    ChangeSquareImage(square, PromoteId);
}

function Check(White = true) {
    if (!(HasMoves(White))) {
        Mate(White);
    } else {
        PlayAudio('SFX/Check.wav');
    }
}

function HasMoves(White = true) {
    let Pieces = GetPieces(White);

    for (var i = 0; i < Pieces.length; i++) {
        let piece = Pieces[i];
        let allowedSquares = GetAllowedSquares(piece);

        if (allowedSquares.length !== 0) {
            return true;
        }
    }

    return false;
}

function Mate(White = true) {

    PlayAudio('SFX/Mate.wav');

    AddScore(!White)
}

function AddScore(White = true) {
    if (White) {
        WhiteScore++;
        $('#WhiteScoreNumber').text(WhiteScore);

    } else {
        BlackScore++;
        $('#BlackScoreNumber').text(BlackScore);
    }
}

function FlipBoard() {
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

function ChangeTurn() {
    WhitesTurn = !WhitesTurn;
}

function GetAllowedSquares(square) {
    let piece = parseInt($(square).attr('piece'));

    let returnSquares = [];

    switch (piece) {
        case 1://pawn
            returnSquares = PawnAllowedSquares(square);
            break;
        case 2://knight
            returnSquares = KnightAllowedSquares(square);
            break;
        case 3://bishap
            returnSquares = BishopAllowedSquares(square);
            break;
        case 4://rook
            returnSquares = RookAllowedSquares(square);
            break;
        case 5://king
            returnSquares = KingAllowedSquares(square);
            break;
        case 6://queen
            returnSquares = QueenAllowedSquares(square);
            break;
        case 7://pawn
            returnSquares = PawnAllowedSquares(square);
            break;
        case 8://knight
            returnSquares = KnightAllowedSquares(square);
            break;
        case 9://bishap
            returnSquares = BishopAllowedSquares(square);
            break;
        case 10://rook
            returnSquares = RookAllowedSquares(square);
            break;
        case 11://king
            returnSquares = KingAllowedSquares(square);
            break;
        case 12://queen
            returnSquares = QueenAllowedSquares(square);
            break;
    }


    returnSquares = CheckPinAndReturn(square, returnSquares);

    return returnSquares;
}

function PawnAllowedSquares(square) {
    let allowedList = [];
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
            if (!HasPiece(sqr)) {
                allowedList.push(sqr);
                if ((IsWhite(square) && number === 2) || (!IsWhite(square) && number === 7)) {
                    let sqr = Squares[file][number + 2 * unit];
                    if (!HasPiece(sqr)) {
                        allowedList.push(sqr);
                    }
                }
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

function GetPawnAtackedSquares(square) {
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

function KnightAllowedSquares(square, atack = false) {
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

function BishopAllowedSquares(square, atack = false) {
    let allowedList = [];
    let temp = [];
    temp.push(GetDiagonalAllowed(1, 1, square, atack));
    temp.push(GetDiagonalAllowed(-1, 1, square, atack));
    temp.push(GetDiagonalAllowed(1, -1, square, atack));
    temp.push(GetDiagonalAllowed(-1, -1, square, atack));

    for (var i = 0; i < temp.length; i++) {
        let list = temp[i];

        for (var j = 0; j < list.length; j++) {
            let item = list[j];
            allowedList.push(item);
        }
    }

    return allowedList;
}

function GetDiagonalAllowed(unit1, unit2, square, atack = false) {
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

function GetVerticalAllowed(square, atack = false) {
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

function RookAllowedSquares(square, atack = false) {
    return GetVerticalAllowed(square, atack);
}

function KingAllowedSquares(square) {
    let allowedList = [];
    let file = parseInt($(square).attr('file'));
    let number = parseInt($(square).attr('number'));

    let enemyAtackedSquares;
    if (IsWhite(square)) {
        enemyAtackedSquares = GetAtackedSquares(false);
    } else {
        enemyAtackedSquares = GetAtackedSquares(true);
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
        if (!(IsCheck(true))) {
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
        if (!(IsCheck(false))) {
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

function GetKingAtackedSquares(square) {

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

function QueenAllowedSquares(square, atack = false) {
    let allowedList = [];
    let temp = [];
    temp.push(GetDiagonalAllowed(1, 1, square, atack));
    temp.push(GetDiagonalAllowed(-1, 1, square, atack));
    temp.push(GetDiagonalAllowed(1, -1, square, atack));
    temp.push(GetDiagonalAllowed(-1, -1, square, atack));
    temp.push(GetVerticalAllowed(square, atack));

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

function GetPieces(White = true) {
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

function GetAtackedSquares(White = true) {
    let pieces = GetPieces(White);
    let atackedList = [];

    for (var i = 0; i < pieces.length; i++) {
        let item = pieces[i];
        let pieceId = GetPieceId(item);
        let atacked = [];
        if (pieceId == 1 || pieceId == 7) {
            atacked = GetPawnAtackedSquares(item);
        } else if (pieceId == 2 || pieceId == 8) {
            atacked = KnightAllowedSquares(item, true);
        } else if (pieceId == 3 || pieceId == 9) {
            atacked = BishopAllowedSquares(item, true);
        } else if (pieceId == 4 || pieceId == 10) {
            atacked = RookAllowedSquares(item, true);
        } else if (pieceId == 5 || pieceId == 11) {
            atacked = GetKingAtackedSquares(item);
        } else if (pieceId == 6 || pieceId == 12) {
            atacked = QueenAllowedSquares(item, true);
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

function IsCheck(White = true) {
    let atackedSquares = GetAtackedSquares(!White);

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

function CheckPinAndReturn(square, allowedSquares) {
    let returnSquares = [];
    let pieceId = GetPieceId(square);

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
            isCheck = IsCheck(isWhite);
            $(sqr)
                .attr("piece", sqrPieceId);

        } else {

            $(sqr).attr('piece', pieceId)
                .addClass('ChessSquareFull');
            try {
                isCheck = IsCheck(isWhite);
            } catch (e) {

            }
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

function ClearBoard() {
    $(".ChessBoard").text('');
    Squares = [0];
}

function RestartGame() {
    if (SelectedSquare !== null) {
        UnSelectSquare(SelectedSquare);
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
    PGN = [];
    UpdatePgnBoard();
    Squares = [0];

    StartGame()

    $("#btnCopyPgn").text('Copy');
}

function StartGame() {
    CreateBoard();
    SetPieces();
    // UpdateFENBoard();
}

function UpdateFENBoard() {
    let txt = CreateFENText();
    $('#txtFENBoard').val(txt);
}

function ShowLastMove(startSquare, endSquare) {
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

function PlayAudio(addres) {
    let myAudio = new Audio(addres);
    myAudio.play();
}

function AddPGN(startSquare, endSquare, takes, promote = null) {

    let pgnMove = CreatePGNMove(startSquare, endSquare, takes, promote);

    PGN.push(pgnMove);

    UpdatePgnBoard();

};

function CreatePGNMove(startSquare, endSquare, takes, promote = null) {
    let startFile = parseInt($(startSquare).attr('file'));
    let startNumber = parseInt($(startSquare).attr('number'));
    let endFile = parseInt($(endSquare).attr('file'));
    let endNumber = parseInt($(endSquare).attr('number'));

    let startPgn = '';
    let midPgn = '';
    let endPgn = FileNames[endFile] + endNumber.toString();

    let PieceId = GetPieceId(endSquare);


    if (PieceId == 5 || PieceId == 11) {
        if (Math.abs(startFile - endFile) == 2) {
            if (endFile == 3) {
                return 'O-O-O';
            } else {
                return 'O-O';
            }
        }
    }

    if (PieceId == 1 || PieceId == 7) {
        if (takes) {
            startPgn = FileNames[startFile];
        }
    } else {
        startPgn = PieceNames[PieceId];

        let otherPieces = GetSquaresWithPieceId(PieceId);
        if (otherPieces.length > 1) {

            let otherAllowed = [];
            for (var i = 0; i < otherPieces.length; i++) {
                let item = otherPieces[i];
                if (item == endSquare) {
                    continue;
                }

                let allowed;

                if (PieceId == 2 || PieceId == 8) {
                    allowed = KnightAllowedSquares(item, true);
                } else if (PieceId == 3 || PieceId == 9) {
                    allowed = BishopAllowedSquares(item, true);
                } else if (PieceId == 4 || PieceId == 10) {
                    allowed = RookAllowedSquares(item, true);
                } else if (PieceId == 6 || PieceId == 12) {
                    allowed = QueenAllowedSquares(item, true);
                }


                if (allowed.includes(endSquare)) {
                    otherAllowed.push(item);
                }
            }
            if (otherAllowed != 0) {
                let isFileExist = false;
                let isNumberExist = false;
                for (var i = 0; i < otherAllowed.length; i++) {
                    let item = otherAllowed[i];
                    let itemFile = parseInt($(item).attr('file'));
                    let itemNumber = parseInt($(item).attr('number'));

                    if (itemFile == startFile) {
                        isFileExist = true;
                    }
                    if (itemNumber == startNumber) {
                        isNumberExist = true;
                    }
                }

                if ((!isFileExist && !isNumberExist)) {
                    startPgn = startPgn + FileNames[startFile];
                } else if (isNumberExist && isFileExist) {
                    startPgn = startPgn + FileNames[startFile] + startNumber;
                } else if (isNumberExist) {
                    startPgn = startPgn + FileNames[startFile];
                } else if (isFileExist) {
                    startPgn = startPgn + startNumber;
                }
            }

        }
    }

    if (takes) {
        midPgn = 'x';
    }

    if (promote !== null) {
        endPgn = endPgn + '=' + promote;
        if (startFile != endFile) {
            startPgn = FileNames[startFile];
        } else {
            startPgn = '';
        }
    }

    let returnPgn = startPgn + midPgn + endPgn;

    if (IsCheck(!IsWhite(endSquare))) {
        if (!(HasMoves(!IsWhite(endSquare)))) {
            returnPgn = returnPgn + '#';
        } else {
            returnPgn = returnPgn + '+';
        }
    }


    return returnPgn;
}

function UpdatePgnBoard() {
    let pgnText = '';

    let counter = 1;
    let isWhite = true;
    for (var i = 0; i < PGN.length; i++) {
        var item = PGN[i];
        if (isWhite) {
            pgnText = pgnText + counter + '. ';
            counter += 1;
        }

        pgnText = pgnText + item + ' '
        isWhite = !isWhite;
    }

    $('#PgnText').text(pgnText);
}

function GetSquaresWithPieceId(PieceId) {
    return $('[piece=' + PieceId + ']').toArray();
}

function ShowPgnModal() {
    $('#txtInsertPgn').val($('#PgnText').text());
    $('#InsertPgnModal').modal('show');
}

function btnInsertPgnClicked() {
    $('#InsertPgnModal').modal('hide');

    let pgnText = $('#txtInsertPgn').val();
    $('#txtInsertPgn').val('');

    pgnText = FixText(pgnText);

    let pgntemp = pgnText.split(' ');
    let pgnArray = [];

    for (var i = 0; i < pgntemp.length; i++) {
        if (i % 3 == 0) {
            continue;
        }

        pgnArray.push(pgntemp[i]);
    }

    CreateBoardWithPgn(pgnArray);

    UpdateFENBoard();
}

function CreateBoardWithPgn(pgnArray = [''], untilMove = null) {
    RestartGame();
    for (var i = 0; i < pgnArray.length; i++) {
        let item = pgnArray[i];

        if (i == untilMove) {
            break;
        }
        let isSuccess = MoveWithPGN(item, (i % 2 == 0));

        if (!isSuccess) {
            break;
        }
    }
}

function MoveWithPGN(item, white,isManual=false) {
    item = item.replace('+', '');
    item = item.replace('#', '');
    item = item.replace('x', '');
    let pgnType = GetPgnType(item);
    if (pgnType == 0) {
        return false;
    }

    let startSquare;
    let endSquare;

    if (pgnType !== 6 && pgnType !== 7 && pgnType !== 8) {
        endSquare = Squares[FileNames.indexOf(item[item.length - 2])][parseInt(item[item.length - 1])];
    }

    let pieceId;
    let squares;
    let CanDo = true;


    switch (pgnType) {
        case 1://(example: e4 or ge4)
            pieceId = 1;
            if (!white) {
                pieceId = 7;
            }

            squares = $('[piece=' + pieceId + '][file=' + FileNames.indexOf(item[0]) + ']').toArray();

            for (var j = 0; j < squares.length; j++) {
                let sqr = squares[j];

                if (CanMove(sqr, endSquare)) {
                    startSquare = sqr
                    break;
                }
            }

            break;

        case 2://(example: Qd4)

            pieceId = PieceNames.indexOf(item[0]);
            if (!white) {
                pieceId = pieceId + 6;
            }

            squares = $('[piece=' + pieceId + ']').toArray();

            for (var j = 0; j < squares.length; j++) {
                let sqr = squares[j];

                if (CanMove(sqr, endSquare)) {
                    startSquare = sqr
                    break;
                }
            }
            break;

        case 3://(example: Qbd4)
            pieceId = PieceNames.indexOf(item[0]);
            if (!white) {
                pieceId = pieceId + 6;
            }

            squares = $('[piece=' + pieceId + '][file=' + FileNames.indexOf(item[1]) + ']').toArray();

            for (var j = 0; j < squares.length; j++) {
                let sqr = squares[j];

                if (CanMove(sqr, endSquare)) {
                    startSquare = sqr
                    break;
                }
            }
            break;

        case 4://(example: Q3d4)
            pieceId = PieceNames.indexOf(item[0]);
            if (!white) {
                pieceId = pieceId + 6;
            }

            squares = $('[piece=' + pieceId + '][number=' + parseInt(item[1]) + ']').toArray();

            for (var j = 0; j < squares.length; j++) {
                let sqr = squares[j];

                if (CanMove(sqr, endSquare)) {
                    startSquare = sqr
                    break;
                }
            }
            break;

        case 5://(example: Qb3d4)
            pieceId = PieceNames.indexOf(item[0]);
            if (!white) {
                pieceId = pieceId + 6;
            }

            squares = $('[piece=' + pieceId + '][file=' + FileNames.indexOf(item[1]) + '][number=' + parseInt(item[2]) + ']').toArray();

            for (var j = 0; j < squares.length; j++) {
                let sqr = squares[j];

                if (CanMove(sqr, endSquare)) {
                    startSquare = sqr
                    break;
                }
            }
            break;

        case 6://O-O
            if (white) {
                if (WhiteShortCastle) {
                    let start = Squares[5][1];
                    let end = Squares[7][1];
                    if (CanMove(start, end)) {
                        startSquare = start;
                        endSquare = end;
                    }
                }
            } else {
                if (BlackShortCastle) {
                    let start = Squares[5][8];
                    let end = Squares[7][8];
                    if (CanMove(start, end)) {
                        startSquare = start;
                        endSquare = end;
                    }
                }
            }
            break;

        case 7://O-O-O
            if (white) {
                if (WhiteLongCastle) {
                    let start = Squares[5][1];
                    let end = Squares[3][1];
                    if (CanMove(start, end)) {
                        startSquare = start;
                        endSquare = end;
                    }
                }
            } else {
                if (BlackLongCastle) {
                    let start = Squares[5][8];
                    let end = Squares[3][8];
                    if (CanMove(start, end)) {
                        startSquare = start;
                        endSquare = end;
                    }
                }
            }
            break;

        case 8://e8=Q or fe8=Q
            CanDo = false;
            pieceId = 1;
            if (!white) {
                pieceId = 7;
            }

            let temp = item.split('=');
            endSquare = Squares[FileNames.indexOf(temp[0][temp[0].length - 2])][parseInt(temp[0][temp[0].length - 1])];

            squares = $('[piece=' + pieceId + '][file=' + FileNames.indexOf(item[0]) + ']').toArray();

            for (var j = 0; j < squares.length; j++) {
                let sqr = squares[j];

                if (CanMove(sqr, endSquare)) {
                    startSquare = sqr;
                    MovePiece(startSquare, endSquare, false, PieceNames.indexOf(temp[1]), false,isManual);
                    break;
                }
            }
            break;
    }

    if (startSquare == null) {
        return false;
    }
    if (CanDo) {
        MovePiece(startSquare, endSquare, false, null, false,isManual);
    }

    return true;
}

function GetPgnType(pgnItem) {

    if (pgnItem == 'O-O') {
        return 6;
    } else if (pgnItem == 'O-O-O') {
        return 7;
    }

    let regex1 = new RegExp("^[a-h]?[a-h][1-8]$");
    let regex2 = new RegExp("^[B|N|R|Q|K][a-h][1-8]$");
    let regex3 = new RegExp("^[B|N|R|Q|K][a-h]{2}[1-8]$");
    let regex4 = new RegExp("^[B|N|R|Q|K][1-8][a-h][1-8]$");
    let regex5 = new RegExp("^[B|N|R|Q|K][a-h][1-8][a-h][1-8]$");
    let regex8 = new RegExp("^[a-h]?[a-h][1-8]=[B|N|R|Q]$");


    if (regex1.test(pgnItem)) {
        return 1;
    } else if (regex2.test(pgnItem)) {
        return 2;
    } else if (regex3.test(pgnItem)) {
        return 3;
    } else if (regex4.test(pgnItem)) {
        return 4;
    } else if (regex5.test(pgnItem)) {
        return 5;
    } else if (regex8.test(pgnItem)) {
        return 8;
    }
    return 0;
}

function CanMove(startSquare, endSquare) {
    let allowedSquares = GetAllowedSquares(startSquare);

    return allowedSquares.includes(endSquare);
}

function CopyToClipboard(copyText) {
    navigator.clipboard.writeText(copyText);
}

function btnCopyPgnClicked() {
    let text = $('#PgnText').text();
    CopyToClipboard(text);

    $("#btnCopyPgn").text('Copied!!');
}

function CreateFENText() {
    let FENText = '';
    for (var i = 8; i >= 1; i--) {
        let counter = 0;
        for (var j = 1; j <= 8; j++) {
            let sqr = Squares[j][i]
            if (HasPiece(sqr)) {
                if (counter > 0) {
                    FENText = FENText + counter.toString();
                    counter = 0;
                }

                let pieceId = GetPieceId(sqr);
                FENText += FENPieceNames[pieceId];

            } else {
                counter++;
            }

            if (j == 8 && counter > 0) {
                FENText = FENText + counter.toString();
            }
        }
        if (i > 1) {
            FENText = FENText + '/';
        }
    }

    if (WhitesTurn) {
        FENText += ' w ';
    } else {
        FENText += ' b ';
    }

    if (WhiteShortCastle) {
        FENText += 'K';
    }
    if (WhiteLongCastle) {
        FENText += 'Q';
    }
    if (BlackShortCastle) {
        FENText += 'k';
    }
    if (BlackLongCastle) {
        FENText += 'q';
    }

    return FENText;
}

function ClearPieces() {
    let temp = $('.ChessSquareFull').toArray();
    for (var i = 0; i < temp.length; i++) {
        let item = temp[i];

        EmptySquare(item);
    }
}

function btnInsertFENClicked() {
    let FENText = $('#txtFENBoard').val();

    CreateBoardWithFEN(FENText);

    UpdateFENBoard();
}

function CreateBoardWithFEN(FEN = '') {
    FEN = FixText(FEN);
    let temp = FEN.split(' ');
    if (temp.length < 2) {
        return false;
    }



    let fenRows = temp[0].split('/');
    if (fenRows.length !== 8) {
        return false;
    }

    if (temp[1] == 'w') {
        WhitesTurn = true;
    } else if (temp[1] == 'b') {
        WhitesTurn = false;
    } else {
        return false;
    }


    if (SelectedSquare !== null) {
        UnSelectSquare(SelectedSquare);
        SelectedSquare = null;
    }

    AllowedSquares = []
    EnPassantSquare = null;
    LastMoveStartSquare = null;
    LastMoveEndSquare = null;
    PGN = [];
    $('.LastMoveSquare').removeClass('LastMoveSquare');

    UpdatePgnBoard();
    ClearPieces();

    let number = 8;
    for (var i = 0; i < fenRows.length; i++) {
        let file = 1;
        let row = fenRows[i];
        for (var j = 0; j < row.length; j++) {
            let item = row[j];

            if (isNaN(item)) {
                let pieceId = FENPieceNames.indexOf(item);

                ChangeSquareImage(Squares[file][number], pieceId)

                file++;
            } else {
                file += parseInt(item);
            }
        }

        number--;
    }

    WhiteShortCastle = false;
    WhiteLongCastle = false;
    BlackLongCastle = false;
    BlackShortCastle = false;

    if (new RegExp('^[K]?[Q]?[k]?[q]?$').test(temp[2])) {

        if (/K{1}/.test(temp[2])) {
            WhiteShortCastle = true;
        }
        if (/Q{1}/.test(temp[2])) {
            WhiteLongCastle = true;
        }
        if (/k{1}/.test(temp[2])) {
            BlackShortCastle = true;
        }
        if (/q{1}/.test(temp[2])) {
            BlackLongCastle = true;
        }
    }


    if (WhitesTurn && IsCheck(!WhitesTurn)) {
        RestartGame();
        return false;
    }

    if (IsCheck(WhitesTurn)) {
        Check(WhitesTurn);
    }
    UpdateFENBoard();
    return true;
}

function FixText(Text) {
    Text = Text.replace(/^\s+/, '');
    Text = Text.replace(/\s+$/, '');
    Text = Text.replaceAll(/\s+/g, ' ');

    return Text;
}

function PreviousMove() {
    if (PGNCopy.length == 0) {
        PGNCopy = PGN;
    }
    if (PGNAt == 0) {
        PGNAt = PGN.length;
    }


    if (PGNAt == 0) {
        return;
    }
    PGNAt--;

    CreateBoardWithPgn(PGNCopy, PGNAt);
}

function NextMove() {
    if (PGNCopy.length == 0) {
        PGNCopy = PGN;
    }
    if (PGNAt == 0) {
        PGNAt = PGN.length;
    }
    if (PGNAt + 1 > PGNCopy.length) {
        return;
    }
    PGNAt++;

    CreateBoardWithPgn(PGNCopy, PGNAt);
}

function ResetPGNCopy() {
    PGNCopy = [];
    PGNAt = 0;
}