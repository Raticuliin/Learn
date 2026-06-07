extends Node2D

var count: int = 0
@onready var timer: Timer = $Timer
@onready var label: Label = $Label

signal milestone_reached()

# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	timer.timeout.connect(increment)
	milestone_reached.connect(stop)

func increment() -> void:
	if (count < 5):
		count += 1
		label.text = str(count)
	else:
		milestone_reached.emit()

func stop() -> void:
	timer.stop();
	print("Timer parado")
