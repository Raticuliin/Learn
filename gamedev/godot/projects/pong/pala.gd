extends ColorRect

@export var speed: float = 200;
@export var key_up: Key
@export var key_down: Key

# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	pass # Replace with function body.


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta: float) -> void:
	if (move_up()):
		position.y = clamp(position.y - speed * delta, 0, 480-40*5)
	if (move_down()):
		position.y = clamp(position.y + speed * delta, 0, 480-40*5)
	
func move_up() -> bool:
	return Input.is_key_pressed(key_up)
	
func move_down() -> bool:
	return Input.is_key_pressed(key_down)
	
