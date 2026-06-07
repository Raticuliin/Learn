extends ColorRect

@export var velocity: Vector2 = Vector2(250, 180)
@export var paddleL: Control
@export var paddleR: Control

signal score(player: int)

func _process(delta: float) -> void:
	position += velocity * delta

	var screen := get_viewport_rect().size

	# rebote en techo y suelo
	if position.y < 0 or position.y + size.y > screen.y:
		velocity.y = -velocity.y

	# colisión con palas: el Rect2 se recalcula CADA frame porque las palas se mueven.
	# Solo invertimos si la pelota va hacia esa pala -> no se queda pegada.
	var ball_rect := Rect2(position, size)
	if velocity.x < 0 and ball_rect.intersects(Rect2(paddleL.position, paddleL.size)):
		velocity.x = -velocity.x
	if velocity.x > 0 and ball_rect.intersects(Rect2(paddleR.position, paddleR.size)):
		velocity.x = -velocity.x
	
	if (position.x < 0):
			score.emit(2)
			position.x = screen.x / 2;
			position.y = screen.y / 2;
	if (position.x > screen.x):
			score.emit(1)
			position.x = screen.x / 2;
			position.y = screen.y / 2;
