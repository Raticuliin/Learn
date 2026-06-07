extends Node2D

@export var speed: float = 200;
@onready var label: Label = $Label;

# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	print("Primera ejecución")


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta: float) -> void:
	label.position.x += speed * delta;
