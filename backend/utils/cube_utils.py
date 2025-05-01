def rotate_face_clockwise(face):
    """Rotate a face 90 degrees clockwise"""
    return [
        face[6], face[3], face[0],
        face[7], face[4], face[1],
        face[8], face[5], face[2]
    ]

def rotate_face_counterclockwise(face):
    """Rotate a face 90 degrees counterclockwise"""
    return [
        face[2], face[5], face[8],
        face[1], face[4], face[7],
        face[0], face[3], face[6]
    ]

def handle_cube_move(move, cube_state):
    """Apply a move to the cube state and return the new state"""
    # Create a deep copy of the cube state
    new_state = [face[:] for face in cube_state]
    print(f"Before move {move}: {cube_state}")

    if move == 'F':
        new_state[4] = rotate_face_clockwise(cube_state[4])
        # Read from original state only
        right_temp = [cube_state[0][0], cube_state[0][3], cube_state[0][6]]
        up_temp = [cube_state[2][6], cube_state[2][7], cube_state[2][8]]
        left_temp = [cube_state[1][2], cube_state[1][5], cube_state[1][8]]
        down_temp = [cube_state[3][0], cube_state[3][1], cube_state[3][2]]
        new_state[0][0] = up_temp[0]
        new_state[0][3] = up_temp[1]
        new_state[0][6] = up_temp[2]
        new_state[3][0] = right_temp[2]
        new_state[3][1] = right_temp[1]
        new_state[3][2] = right_temp[0]
        new_state[1][2] = down_temp[0]
        new_state[1][5] = down_temp[1]
        new_state[1][8] = down_temp[2]
        new_state[2][6] = left_temp[2]
        new_state[2][7] = left_temp[1]
        new_state[2][8] = left_temp[0]
    elif move == 'B':
        new_state[5] = rotate_face_clockwise(cube_state[5])
        right_temp = [cube_state[0][2], cube_state[0][5], cube_state[0][8]]
        up_temp = [cube_state[2][0], cube_state[2][1], cube_state[2][2]]
        left_temp = [cube_state[1][0], cube_state[1][3], cube_state[1][6]]
        down_temp = [cube_state[3][6], cube_state[3][7], cube_state[3][8]]
        new_state[1][0] = up_temp[0]
        new_state[1][3] = up_temp[1]
        new_state[1][6] = up_temp[2]
        new_state[3][6] = left_temp[2]
        new_state[3][7] = left_temp[1]
        new_state[3][8] = left_temp[0]
        new_state[0][2] = down_temp[0]
        new_state[0][5] = down_temp[1]
        new_state[0][8] = down_temp[2]
        new_state[2][0] = right_temp[2]
        new_state[2][1] = right_temp[1]
        new_state[2][2] = right_temp[0]
    elif move == 'R':
        new_state[0] = rotate_face_clockwise(cube_state[0])
        up_temp = [cube_state[2][2], cube_state[2][5], cube_state[2][8]]
        front_temp = [cube_state[4][2], cube_state[4][5], cube_state[4][8]]
        down_temp = [cube_state[3][2], cube_state[3][5], cube_state[3][8]]
        back_temp = [cube_state[5][0], cube_state[5][3], cube_state[5][6]]
        new_state[4][2] = up_temp[0]
        new_state[4][5] = up_temp[1]
        new_state[4][8] = up_temp[2]
        new_state[3][2] = front_temp[0]
        new_state[3][5] = front_temp[1]
        new_state[3][8] = front_temp[2]
        new_state[5][0] = down_temp[2]
        new_state[5][3] = down_temp[1]
        new_state[5][6] = down_temp[0]
        new_state[2][2] = back_temp[2]
        new_state[2][5] = back_temp[1]
        new_state[2][8] = back_temp[0]
    elif move == 'L':
        new_state[1] = rotate_face_clockwise(cube_state[1])
        up_temp = [cube_state[2][0], cube_state[2][3], cube_state[2][6]]
        front_temp = [cube_state[4][0], cube_state[4][3], cube_state[4][6]]
        down_temp = [cube_state[3][0], cube_state[3][3], cube_state[3][6]]
        back_temp = [cube_state[5][2], cube_state[5][5], cube_state[5][8]]
        new_state[5][2] = up_temp[2]
        new_state[5][5] = up_temp[1]
        new_state[5][8] = up_temp[0]
        new_state[3][0] = back_temp[2]
        new_state[3][3] = back_temp[1]
        new_state[3][6] = back_temp[0]
        new_state[4][0] = down_temp[0]
        new_state[4][3] = down_temp[1]
        new_state[4][6] = down_temp[2]
        new_state[2][0] = front_temp[0]
        new_state[2][3] = front_temp[1]
        new_state[2][6] = front_temp[2]
    elif move == 'U':
        new_state[2] = rotate_face_clockwise(cube_state[2])
        front_temp = [cube_state[4][0], cube_state[4][1], cube_state[4][2]]
        right_temp = [cube_state[0][0], cube_state[0][1], cube_state[0][2]]
        back_temp = [cube_state[5][0], cube_state[5][1], cube_state[5][2]]
        left_temp = [cube_state[1][0], cube_state[1][1], cube_state[1][2]]
        new_state[1][0] = front_temp[0]
        new_state[1][1] = front_temp[1]
        new_state[1][2] = front_temp[2]
        new_state[5][0] = left_temp[0]
        new_state[5][1] = left_temp[1]
        new_state[5][2] = left_temp[2]
        new_state[0][0] = back_temp[0]
        new_state[0][1] = back_temp[1]
        new_state[0][2] = back_temp[2]
        new_state[4][0] = right_temp[0]
        new_state[4][1] = right_temp[1]
        new_state[4][2] = right_temp[2]
    elif move == 'D':
        new_state[3] = rotate_face_clockwise(cube_state[3])
        front_temp = [cube_state[4][6], cube_state[4][7], cube_state[4][8]]
        right_temp = [cube_state[0][6], cube_state[0][7], cube_state[0][8]]
        back_temp = [cube_state[5][6], cube_state[5][7], cube_state[5][8]]
        left_temp = [cube_state[1][6], cube_state[1][7], cube_state[1][8]]
        new_state[0][6] = front_temp[0]
        new_state[0][7] = front_temp[1]
        new_state[0][8] = front_temp[2]
        new_state[5][6] = right_temp[0]
        new_state[5][7] = right_temp[1]
        new_state[5][8] = right_temp[2]
        new_state[1][6] = back_temp[0]
        new_state[1][7] = back_temp[1]
        new_state[1][8] = back_temp[2]
        new_state[4][6] = left_temp[0]
        new_state[4][7] = left_temp[1]
        new_state[4][8] = left_temp[2]
    elif move in ['F\'', 'B\'', 'L\'', 'R\'', 'U\'', 'D\'']:
        base_move = move[0]
        for _ in range(3):
            new_state = handle_cube_move(base_move, new_state)
    
    print(f"After move {move}: {new_state}")
    # Verify the state has actually changed
    changed = new_state != cube_state
    print(f"State changed: {changed}")
    return new_state 