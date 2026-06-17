# boss.gd
class_name Boss
extends Enemy

var phase: int = 1

func _init(hp: int, speed: float, phase: int) -> void:
	super(hp, speed)        # ejecuta el _init de Enemy
	self.phase = phase
