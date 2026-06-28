extends Node2D

# Módulo 6 · Math para juegos
# Escena: Main (Node2D) con un hijo "Chaser" (Sprite2D o Polygon2D triangular).
# Adjunta este script a Main. Ejecuta con F6.
#
# Partes 1 y 2: consola (corren una vez en _ready, imprimen en Output).
# Partes 3, 4 y 5: visuales (corren cada frame en _process).
# Parte 6: pregunta de comprensión (responde en el comentario del final).

# referencia al hijo que perseguirá al ratón (asegúrate de que se llama "Chaser")
@onready var chaser: Node2D = $Chaser

var speed := 300.0   # píxeles por segundo


func _ready() -> void:
	parte_1_vectores()
	parte_2_angulos()


# --- Parte 1: vectores a mano (consola) ---
func parte_1_vectores() -> void:
	var a := Vector2(10, 10)
	var b := Vector2(40, 50)

	# Imprime el vector que va DE a HACIA b (pista: una resta).
	print(b-a)
	# Imprime su longitud (= distancia entre a y b).
	print((b-a).length())
	# Imprime su dirección normalizada.
	print((b-a).normalized())
	
	# Comprueba que a.distance_to(b) y a.direction_to(b) dan lo mismo
	#       que lo que calculaste a mano arriba.
	print(a.distance_to(b))
	print(a.direction_to(b))


# --- Parte 2: ángulos (consola) ---
func parte_2_angulos() -> void:
	var dir := Vector2(10, 10).direction_to(Vector2(40, 50))

	# Imprime el ángulo de dir EN GRADOS (pista: angle() da radianes,
	#       conviértelo con rad_to_deg).
	
	print(rad_to_deg(dir.angle()));
	
	# Reconstruye un vector unitario desde ese ángulo con
	#       Vector2.from_angle(...) e imprímelo: debe coincidir con dir.
	
	print(Vector2.from_angle(dir.angle()))
	print(dir)


# --- Partes 3, 4 y 5: el chaser (visual) ---
func _process(delta: float) -> void:
	var mouse := get_global_mouse_position()

	# Parte 3 — PERSEGUIR:
	# Mueve chaser.global_position hacia el ratón con move_toward,
	#       escalando el paso por (speed * delta). Mira cómo se para al llegar.
	# chaser.global_position = chaser.global_position.move_toward(mouse, speed * delta)

	# Parte 4 — MIRAR (versión instantánea):
	# Haz que chaser gire para mirar al ratón (look_at(mouse) o
	#       asignando chaser.rotation con angle_to_point).
	# chaser.look_at(mouse)

	# Parte 5 — SUAVIZAR:
	# Sustituye la rotación instantánea de la parte 4 por una suave con
	#       lerp_angle(rotation_actual, rotation_objetivo, 0.1).
	chaser.rotation = lerp_angle(chaser.rotation, chaser.global_position.angle_to_point(mouse), 0.1)
	# Stretch: suaviza también la posición con lerp en vez de move_toward y
	#       nota la diferencia (lerp frena al acercarse, no clava el destino).
	chaser.global_position = chaser.global_position.lerp(mouse, .1)


# --- Parte 6: pregunta de comprensión (responde aquí en 1-2 frases) ---
# 1) ¿Por qué para rotar usamos lerp_angle y no lerp?
# RESPUESTA: Porque lerp_angle sabe que los angulos pueden ser 360 y va por el camino corto
#
# 2) Si en la parte 3 usaras direction_to(raton) * speed * delta en vez de
#    move_toward, ¿qué pasaría cuando el chaser llega justo encima del ratón?
# RESPUESTA: Que se movería haciendo saltos, move_toward calcula el paso minimo y entonces llega a 0
