// const email = 'kanshul45+w@gmail.com';
// document.getElementById('email').innerHTML = `<a href="mailto:${email}">${email}</a>`;

// Game logic
function initGame() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const game = {
        player: {
            x: canvas.width / 2 - 10,
            y: canvas.height - 30,
            width: 30,
            height: 30,
            speed: 200,
            movingLeft: false,
            movingRight: false,
            movingUp: false,
            movingDown: false
        },
        bullets: [],
        enemies: [],
        explosions: [],
        score: 0,
        lives: 3,
        level: 1,
        gameOver: false,
        lastEnemySpawn: 0,
        enemySpawnInterval: 1000,
        lastLevelUp: 0,
        levelUpInterval: 30000,
        gameStarted: false,
        lastTime: 0
    };

    function drawPlayer() {
        ctx.fillStyle = '#8E9F8C';
        ctx.fillRect(game.player.x, game.player.y, game.player.width, game.player.height);
    }

    function drawBullets() {
        ctx.fillStyle = '#A39081';
        game.bullets.forEach(bullet => {
            ctx.fillRect(bullet.x, bullet.y, 5, 10);
        });
    }

    function drawEnemies() {
        ctx.fillStyle = '#8F7A66';
        game.enemies.forEach(enemy => {
            ctx.fillRect(enemy.x, enemy.y, 20, 20);
        });
    }

    function drawExplosions() {
        ctx.fillStyle = '#A7B9A5';
        game.explosions.forEach(explosion => {
            ctx.beginPath();
            ctx.arc(explosion.x, explosion.y, explosion.radius, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    function updateGame(deltaTime) {
        // Move player
        if (game.player.movingLeft) {
            game.player.x = Math.max(0, game.player.x - game.player.speed * deltaTime);
        }
        if (game.player.movingRight) {
            game.player.x = Math.min(canvas.width - game.player.width, game.player.x + game.player.speed * deltaTime);
        }
        if (game.player.movingUp) {
            game.player.y = Math.max(canvas.height * 0.75, game.player.y - game.player.speed * deltaTime);
        }
        if (game.player.movingDown) {
            game.player.y = Math.min(canvas.height - game.player.height, game.player.y + game.player.speed * deltaTime);
        }

        // Move bullets
        game.bullets.forEach(bullet => {
            bullet.y -= 8;
        });
        game.bullets = game.bullets.filter(bullet => bullet.y > 0);

        // Move enemies
        const baseSpeed = 120; // pixels per second (adjust as needed)
        game.enemies.forEach(enemy => {
            enemy.y += (baseSpeed + (game.level - 1) * 30) * deltaTime;
        });
        game.enemies = game.enemies.filter(enemy => enemy.y < canvas.height);

        // Spawn new enemies
        if (Date.now() - game.lastEnemySpawn > game.enemySpawnInterval) {
            game.enemies.push({
                x: Math.random() * (canvas.width - 20),
                y: 0
            });
            game.lastEnemySpawn = Date.now();
        }

        // Check collisions
        game.bullets.forEach(bullet => {
            game.enemies.forEach((enemy, index) => {
                if (bullet.x < enemy.x + 20 && bullet.x + 5 > enemy.x &&
                    bullet.y < enemy.y + 20 && bullet.y + 10 > enemy.y) {
                    game.enemies.splice(index, 1);
                    game.score += 10;
                    game.explosions.push({x: enemy.x + 10, y: enemy.y + 10, radius: 1});
                }
            });
        });

        // Update explosions
        game.explosions.forEach(explosion => {
            explosion.radius += 0.5;
        });
        game.explosions = game.explosions.filter(explosion => explosion.radius < 20);

        // Check player collision
        game.enemies.forEach((enemy, index) => {
            if (game.player.x < enemy.x + 20 && game.player.x + 20 > enemy.x &&
                game.player.y < enemy.y + 20 && game.player.y + 20 > enemy.y) {
                game.enemies.splice(index, 1);
                game.lives--;
                if (game.lives <= 0) {
                    game.gameOver = true;
                }
            }
        });

        // Level up
        if (Date.now() - game.lastLevelUp > game.levelUpInterval) {
            game.level++;
            game.enemySpawnInterval = Math.max(300, game.enemySpawnInterval - 100);
            game.lastLevelUp = Date.now();
        }

        // Update UI
        document.getElementById('score').textContent = `Score: ${game.score}`;
        document.getElementById('level').textContent = `Level: ${game.level}`;
        document.getElementById('lives').textContent = `${'❤️'.repeat(game.lives)}`;
    }

    function gameLoop(timestamp) {
        if (!game.lastTime) game.lastTime = timestamp;
        const deltaTime = (timestamp - game.lastTime) / 1000; // Convert to seconds
        game.lastTime = timestamp;

        if (!game.gameOver && game.gameStarted) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawPlayer();
            drawBullets();
            drawEnemies();
            drawExplosions();
            updateGame(deltaTime);  // Pass deltaTime to updateGame
            requestAnimationFrame(gameLoop);
        } else if (game.gameOver) {
            document.getElementById('game-over').style.display = 'block';
            document.getElementById('final-score').textContent = game.score;
        }
    }

    function hideGame() {
        game.gameStarted = false;
        game.gameOver = false;
        document.getElementById('game-ui').style.display = 'none';
        document.getElementById('game-over').style.display = 'none';
        document.querySelector('.initial-controls').style.display = 'block';
        document.querySelector('.active-controls').style.display = 'none';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            hideGame();
            return;
        }

        if (!game.gameStarted) {
            game.gameStarted = true;
            document.getElementById('game-ui').style.display = 'block';
            document.querySelector('.initial-controls').style.display = 'none';
            document.querySelector('.active-controls').style.display = 'block';
            gameLoop();
        }

        if (game.gameOver && e.key === 'Enter') {
            // Restart game
            game.gameOver = false;
            game.score = 0;
            game.lives = 3;
            game.level = 1;
            game.enemies = [];
            game.bullets = [];
            game.explosions = [];
            game.lastEnemySpawn = 0;
            game.enemySpawnInterval = 1000;
            game.lastLevelUp = 0;
            game.player.x = canvas.width / 2 - 10;
            game.player.y = canvas.height - 30;
            document.getElementById('game-over').style.display = 'none';
            gameLoop();
        } else if (!game.gameOver) {
            switch(e.key) {
                case 'ArrowLeft':
                case 'a':
                    game.player.movingLeft = true;
                    break;
                case 'ArrowRight':
                case 'd':
                    game.player.movingRight = true;
                    break;
                case 'ArrowUp':
                case 'w':
                    game.player.movingUp = true;
                    break;
                case 'ArrowDown':
                case 's':
                    game.player.movingDown = true;
                    break;
                case ' ':
                    if (game.bullets.length < 3) {
                        game.bullets.push({x: game.player.x + 7.5, y: game.player.y});
                    }
                    break;
            }
        }
    });

    document.addEventListener('keyup', (e) => {
        switch(e.key) {
            case 'ArrowLeft':
            case 'a':
                game.player.movingLeft = false;
                break;
            case 'ArrowRight':
            case 'd':
                game.player.movingRight = false;
                break;
            case 'ArrowUp':
            case 'w':
                game.player.movingUp = false;
                break;
            case 'ArrowDown':
            case 's':
                game.player.movingDown = false;
                break;
        }
    });

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        game.player.x = canvas.width / 2 - 10;
        game.player.y = canvas.height - 30;
    });

    gameLoop();
}

window.onload = initGame;