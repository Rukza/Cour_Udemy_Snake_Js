window.onload = function() {

  var canvaswidth = 900;
  var canvasheight = 600;
  var blocksize = 30;
  var ctx;
  var delay = 100;
  var snaky;
  var applee;
  var widthInBlocks = canvaswidth / blocksize;
  var heightInBlocks = canvasheight / blocksize;
  var score;
  var timeout;

  init();


  function init() {

    var canvas = document.createElement('canvas'); //dessiner des formes en html//
    canvas.width = canvaswidth; //largeur//
    canvas.height = canvasheight; //hauteur//
    canvas.style.border = "30px solid gray";
    canvas.style.margin = "50px auto";
    canvas.style.display = "block";
    canvas.style.backgroundColor = "#ddd"
    document.body.appendChild(canvas); //attacher le canvas a la pages html//
    ctx = canvas.getContext('2d'); //attraper le context du canvas dessin en 2d//
    snaky = new Snake([
      [6, 4],
      [5, 4],
      [4, 4]
    ], "right"); //chq block du serpent sera dans un array avec 2 axe
    applee = new Apple([10, 10]);
    score = 0;
    refreshcanvas();


  } //end init

  function refreshcanvas() //refresh le canvas//
  {
    snaky.advance();
    if (snaky.checkCollision()) {
      gameOver();
    } else {
      if (snaky.isEatingApple(applee)) {
        score++;
        snaky.ateApple = true;
        do {
          applee.setNewPosition();
        }
        while (applee.isOnSnake(snaky))
      }
      ctx.clearRect(0, 0, canvaswidth, canvasheight); //enleve l'ancien dessin pour ne pas avoir de doublon//
      drawScore();
      snaky.draw();
      applee.draw();
      timeout = setTimeout(refreshcanvas, delay); //permet de faire re exe une fonction tout les x delay//

    }

  } //end function refreshcanvas//

  function gameOver() {
    ctx.save();
    ctx.font = "bold 70px sans-serif"
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.strokeStyle = "white";
    ctx.lineWidth = 5;
    var centreX = canvaswidth / 2;
    var centreY = canvasheight / 2;
    ctx.strokeText("Game Over", centreX, centreY - 180);
    ctx.fillText("Game Over", centreX, centreY - 180);
    ctx.font = "bold 30px sans-serif"
    ctx.strokeText("Push Space to start a new game", centreX, centreY - 120);
    ctx.fillText("Push Space to start a new game", centreX, centreY - 120); //1er arg le txt que l'on veut a l'ecran , puis l'endroit ou on le veux//
    ctx.restore();
  };

  function restart() {
    snaky = new Snake([
      [6, 4],
      [5, 4],
      [4, 4]
    ], "right");
    applee = new Apple([10, 10]);
    score = 0;
    clearTimeout(timeout);
    refreshcanvas();
  }

  function drawScore() {
    ctx.save();
    ctx.font = "bold 100px sans-serif"
    ctx.fillStyle = "gray";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    var centreX = canvaswidth / 2;
    var centreY = canvasheight / 2;
    ctx.fillText(score.toString(), centreX, centreY);
    ctx.restore();
  }

  function drawblock(ctx, position) {
    var x = position[0] * blocksize;
    var y = position[1] * blocksize;
    ctx.fillRect(x, y, blocksize, blocksize);
  }

  function Snake(body, direction) {
    this.body = body;
    this.direction = direction;
    this.ateApple = false;
    this.draw = function() {
      ctx.save();
      ctx.fillStyle = "#ff0000";
      for (var i = 0; i < this.body.length; i++) //dessine a l'ecran chq block//
      {
        drawblock(ctx, this.body[i]);
      }
      ctx.restore(); //garde le contex comme il etait avant//
    }; //end thisdraw//
    this.advance = function() {
      var nextPosition = this.body[0].slice(); //slice permet de copié l'element//
      switch (this.direction) {
        case "left":
          nextPosition[0] -= 1;
          break;
        case "right":
          nextPosition[0] += 1;
          break;
        case "down":
          nextPosition[1] += 1;
          break;
        case "up":
          nextPosition[1] -= 1;
          break;
        default:
          throw ("Nope");
      }
      this.body.unshift(nextPosition);
      if (!this.ateApple)
        this.body.pop(); //virer le dernier element du array//
      else
        this.ateApple = false;

    };
    this.setDirection = function(newDirection) {
      var allowedDirection; //empecher le serpent d'avoir des direction a la con//
      switch (this.direction) {
        case "left":
        case "right":
          allowedDirection = ["up", "down"];
          break;
        case "down":
        case "up":
          allowedDirection = ["left", "right"];
          break;
        default:
          throw ("Nope");
      }
      if (allowedDirection.indexOf(newDirection) > -1) //indexof retourne 1 si la direction est permise et -1 pr une non permise//
      {
        this.direction = newDirection;
      }
    };
    this.checkCollision = function() { //verification des colisions pour game over//
      var wallCollision = false;
      var snakeCollision = false;
      var head = this.body[0]; //definition de la tête et du corp//
      var rest = this.body.slice(1);
      var snakeX = head[0];
      var snakeY = head[1];
      var minX = 0; //def des murs
      var minY = 0;
      var maxX = widthInBlocks - 1;
      var maxY = heightInBlocks - 1;
      var inWallX = snakeX < minX || snakeX > maxX; //verif si entre les murs
      var inWallY = snakeY < minY || snakeY > maxY;

      if (inWallX || inWallY)
        wallCollision = true; //valide le game over mur//


      for (var i = 0; i < rest.length; i++) {
        if (snakeX === rest[i][0] && snakeY === rest[i][1]) //verfi si les x et y pour colision corp//
          snakeCollision = true;

      }
      return wallCollision || snakeCollision;
    };
    this.isEatingApple = function(appleToEat) {
      var head = this.body[0];

      if (head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1]) //verif si x et y de la tete = a la pomme pr la manger
        return true;
      else
        return false;

    };


  } //end function Snake//

  function Apple(position) {
    this.position = position;
    this.draw = function() {
      ctx.save();
      ctx.fillStyle = "#33cc33";
      ctx.beginPath();
      var radius = blocksize / 2; //taille pomme//
      var x = this.position[0] * blocksize + radius; //position de la pomme x//
      var y = this.position[1] * blocksize + radius; //position de la pomme y//
      ctx.arc(x, y, radius, 0, Math.PI * 2, true);
      ctx.fill();
      ctx.restore(); //vas empecher de tjrs mettre le mm couleur dans le canvas//
    };
    this.setNewPosition = function() {
      var newX = Math.round(Math.random() * (widthInBlocks - 1));
      var newY = Math.round(Math.random() * (heightInBlocks - 1));
      this.position = [newX, newY];
    };
    this.isOnSnake = function(snakeToCheck) {
      var isOnSnake = false;
      for (var i = 0; i < snakeToCheck.body.length; i++) //verif sur toute la longeur du snake qu'une pomme soi pas dessus//
      {
        if (this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1]) {
          isOnSnake = true;
        }
      }
      return isOnSnake;
    };


  }


  document.onkeydown = function handleKeyDown(e) {
    var key = e.keyCode; //me donne le code de la touche appuyé//
    var newDirection;
    switch (key) {
      case 37:
        newDirection = "left";
        break;
      case 38:
        newDirection = "up";
        break;
      case 39:
        newDirection = "right";
        break;
      case 40:
        newDirection = "down";
        break;
      case 32:
        restart()
        return;
      default:
        return;
    } //end switch//
    snaky.setDirection(newDirection);
  } //end function//


} //end end//
