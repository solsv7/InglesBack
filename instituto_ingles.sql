-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 06, 2025 at 09:28 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `instituto_ingles`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `ActualizarClase` (IN `p_id_clase` INT, IN `p_id_dia` INT, IN `p_id_nivel` INT, IN `p_hora_inicio` TIME, IN `p_hora_fin` TIME)   BEGIN
  UPDATE clases
  SET
    id_dia = p_id_dia,
    id_nivel = p_id_nivel,
    hora_inicio = p_hora_inicio,
    hora_fin = p_hora_fin
  WHERE id_clase = p_id_clase;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `ActualizarInscripcion` (IN `p_id_alumno` INT, IN `p_id_clase_actual` INT, IN `p_id_clase_nueva` INT)   BEGIN
    UPDATE clases_alumnos
    SET id_clase = p_id_clase_nueva
    WHERE id_alumno = p_id_alumno AND id_clase = p_id_clase_actual;
END$$


CREATE PROCEDURE actualizarPerfil(
    IN p_id_usuario INT,
    IN p_whatsapp VARCHAR(255),
    IN p_whatsapp_adulto VARCHAR(255),
    IN p_mail VARCHAR(255),
    IN p_id_foto INT
)
BEGIN
    DECLARE v_id_perfil INT;

    -- Guardar el id_perfil en una variable
    SELECT perfil.id_perfil
    INTO v_id_perfil
    FROM perfil
    JOIN usuario 
        ON perfil.id_alumno = usuario.id_alumno
        OR perfil.id_profesor = usuario.id_profesor
    WHERE usuario.id_usuario = p_id_usuario
    LIMIT 1;

    -- Actualizar usando la variable
    UPDATE perfil
    SET
        whatsapp = COALESCE(p_whatsapp, whatsapp),
        whatsapp_adulto = COALESCE(p_whatsapp_adulto, whatsapp_adulto),
        mail = COALESCE(p_mail, mail),
        id_foto = COALESCE(p_id_foto, id_foto)
    WHERE id_perfil = v_id_perfil;
END$$



CREATE DEFINER=`root`@`localhost` PROCEDURE `actualizar_contrasenia` (IN `p_id_usuario` INT, IN `p_nueva_contrasenia` VARCHAR(255))   BEGIN
    UPDATE usuario
    SET password = p_nueva_contrasenia
    WHERE id_usuario = p_id_usuario;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `AgregarNivel` (IN `p_nombre` VARCHAR(100), IN `p_idioma` VARCHAR(50))   BEGIN
  INSERT INTO niveles (nombre, idioma, activo)
  VALUES (p_nombre, p_idioma, 1);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `crearAlumno` (IN `p_dni` INT, IN `p_nombre` VARCHAR(255), IN `p_password` VARCHAR(255), IN `p_mail` VARCHAR(255), IN `p_whatsapp` VARCHAR(255), IN `p_whatsapp_adulto` VARCHAR(255), OUT `p_id_usuario` INT)   BEGIN
    DECLARE p_id_persona INT;

    -- Paso 1: Insertar en la tabla Usuario
    INSERT INTO usuario (id_alumno, id_profesor, id_rol, password)
    VALUES (NULL, NULL, 3, p_password);
    SET p_id_usuario = LAST_INSERT_ID(); -- Obtener el ID del usuario recién creado

    -- Verificar si el alumno ya existe
    IF NOT EXISTS (SELECT 1 FROM alumno WHERE dni_alumno = p_dni) THEN
        -- Insertar un nuevo alumno
        INSERT INTO alumno (dni_alumno, nombre, id_clase)
        VALUES (p_dni, p_nombre, NULL);
        SET p_id_persona = LAST_INSERT_ID(); -- Obtener el ID del alumno insertado
    ELSE
        -- Si ya existe, obtener el ID del alumno
        SET p_id_persona = (SELECT id_alumno FROM alumno WHERE dni_alumno = p_dni);
    END IF;

    -- Actualizar la tabla Usuario con el ID del alumno
    UPDATE usuario SET id_alumno = p_id_persona WHERE id_usuario = p_id_usuario;

    -- Insertar en la tabla perfil
    INSERT INTO perfil (nombre, whatsapp, whatsapp_adulto, mail, id_alumno)
    VALUES (p_nombre, p_whatsapp, p_whatsapp_adulto, p_mail, p_id_persona);

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `CrearCuota` (IN `p_id_alumno` INT, IN `p_id_plan` INT, IN `p_fecha_inicio` DATE, IN `p_fecha_vencimiento` DATE)   BEGIN
  INSERT INTO cuotas (
    id_alumno,
    id_plan,
    fecha_inicio,
    fecha_vencimiento,
    estado_pago
  )
  VALUES (
    p_id_alumno,
    p_id_plan,
    p_fecha_inicio,
    p_fecha_vencimiento,
    'pendiente'
  );
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `CrearPeriodo` (IN `p_nombre` VARCHAR(100))   BEGIN
    INSERT INTO periodos (nombre, activo)
    VALUES (p_nombre, 1);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `CrearPlan` (IN `p_nombre` VARCHAR(100), IN `p_descripcion` TEXT, IN `p_monto` DECIMAL(10,2))   BEGIN
  INSERT INTO planes (nombre, descripcion, monto, activa)
  VALUES (p_nombre, p_descripcion, p_monto, TRUE);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `crearProfesor` (IN `p_dni` INT, IN `p_nombre` VARCHAR(255), IN `p_password` VARCHAR(255), IN `p_mail` VARCHAR(255), OUT `p_id_usuario` INT)   BEGIN
    DECLARE p_id_persona INT;

    -- Paso 1: Insertar en la tabla Usuario
    INSERT INTO usuario (id_alumno, id_profesor, id_rol, password)
    VALUES (NULL, NULL, 2, p_password);
    SET p_id_usuario = LAST_INSERT_ID(); -- Obtener el ID del usuario recién creado

    -- Verificar si el profesor ya existe
    IF NOT EXISTS (SELECT 1 FROM profesor WHERE profesor.dni = p_dni) THEN
        -- Insertar un nuevo profesor
        INSERT INTO profesor (profesor.dni, nombre, userId)
        VALUES (p_dni, p_nombre, p_id_usuario); -- Asociar el usuario creado
        SET p_id_persona = LAST_INSERT_ID(); -- Obtener el ID del profesor insertado
    ELSE
        -- Si ya existe, obtener el ID del profesor
        SET p_id_persona = (SELECT id_profesor FROM profesor WHERE profesor.dni = p_dni);

        -- Asegurarse de que el usuario esté vinculado al profesor existente
        UPDATE profesor SET userId = p_id_usuario WHERE id_profesor = p_id_persona;
    END IF;

    -- Actualizar la tabla Usuario con el ID del profesor
    UPDATE usuario SET id_profesor = p_id_persona WHERE id_usuario = p_id_usuario;

    -- Insertar en la tabla perfil
    INSERT INTO perfil (nombre, whatsapp, mail, id_profesor)
    VALUES (p_nombre, NULL, p_mail, p_id_persona);

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `crearUsuario` (IN `p_dni_alumno` VARCHAR(255), IN `p_nombre` VARCHAR(255), IN `p_password` VARCHAR(255))   BEGIN
    INSERT INTO usuario (id_alumno, id_profesor, id_rol, usuario.password)
    VALUES (null, null, 4, p_password);
    
    INSERT INTO alumno (dni_alumno, nombre, id_clase)
    VALUES(p_dni_alumno,p_nombre,null);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `CrearUsuarioConPersona` (IN `p_dni` INT, IN `p_nombre` VARCHAR(255), IN `p_password` VARCHAR(255), IN `p_rol` INT, IN `p_id_clase` INT, OUT `p_id_usuario` INT)   BEGIN
    DECLARE p_id_persona INT;

    -- Paso 1: Insertar en la tabla Usuario
    INSERT INTO usuario (id_alumno, id_profesor, id_rol, password)
    VALUES (NULL, NULL, p_rol, p_password);
    SET p_id_usuario = LAST_INSERT_ID(); -- Obtener el ID del usuario recién creado

    -- Paso 2: Insertar o actualizar la tabla correspondiente según el rol
    IF p_rol = 2 THEN
        -- Profesor
        INSERT INTO profesor (dni, nombre, userId)
        VALUES (p_dni, p_nombre, p_id_usuario);
        SET p_id_persona = LAST_INSERT_ID(); -- Obtener el ID del profesor insertado

        -- Actualizar la tabla Usuario con el ID del profesor
        UPDATE usuario SET id_profesor = p_id_persona WHERE id_usuario = p_id_usuario;

    ELSEIF p_rol = 3 THEN
        -- Alumno: Verificar si ya existe
        IF NOT EXISTS (SELECT 1 FROM alumno WHERE dni_alumno = p_dni) THEN
            -- Insertar un nuevo alumno
            INSERT INTO alumno (dni_alumno, nombre, id_clase)
            VALUES (p_dni, p_nombre, p_id_clase);
            SET p_id_persona = LAST_INSERT_ID(); -- Obtener el ID del alumno insertado
        ELSE
            -- Si ya existe, obtener el ID del alumno
            SET p_id_persona = (SELECT id_alumno FROM alumno WHERE dni_alumno = p_dni);
        END IF;

        -- Actualizar la tabla Usuario con el ID del alumno
        UPDATE usuario SET id_alumno = p_id_persona WHERE id_usuario = p_id_usuario;
    END IF;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `CrearUsuarioConPersona2` (IN `p_dni` INT, IN `p_nombre` VARCHAR(255), IN `p_password` VARCHAR(255), IN `p_rol` INT, IN `p_id_clase` INT, IN `p_mail` VARCHAR(255), IN `p_whatsapp` VARCHAR(255), IN `p_whatsapp_adulto` VARCHAR(255), OUT `p_id_usuario` INT)   BEGIN
    DECLARE p_id_persona INT;

    -- Paso 1: Insertar en la tabla Usuario
    INSERT INTO usuario (id_alumno, id_profesor, id_rol, password)
    VALUES (NULL, NULL, p_rol, p_password);
    SET p_id_usuario = LAST_INSERT_ID(); -- Obtener el ID del usuario recién creado

    -- Paso 2: Insertar o actualizar la tabla correspondiente según el rol
    IF p_rol = 2 THEN
        -- Profesor
        INSERT INTO profesor (dni, nombre, userId)
        VALUES (p_dni, p_nombre, p_id_usuario);
        SET p_id_persona = LAST_INSERT_ID(); -- Obtener el ID del profesor insertado

        -- Actualizar la tabla Usuario con el ID del profesor
        UPDATE usuario SET id_profesor = p_id_persona WHERE id_usuario = p_id_usuario;

    ELSEIF p_rol = 3 THEN
        -- Alumno: Verificar si el ID de clase es válido
        IF p_id_clase IS NOT NULL AND NOT EXISTS (SELECT 1 FROM clases WHERE id_clase = p_id_clase) THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'El ID de clase proporcionado no existe.';
        END IF;

        -- Alumno: Verificar si ya existe
        IF NOT EXISTS (SELECT 1 FROM alumno WHERE dni_alumno = p_dni) THEN
            -- Insertar un nuevo alumno
            INSERT INTO alumno (dni_alumno, nombre, id_clase)
            VALUES (p_dni, p_nombre, p_id_clase);
            SET p_id_persona = LAST_INSERT_ID(); -- Obtener el ID del alumno insertado
        ELSE
            -- Si ya existe, obtener el ID del alumno
            SET p_id_persona = (SELECT id_alumno FROM alumno WHERE dni_alumno = p_dni);
        END IF;

        -- Actualizar la tabla Usuario con el ID del alumno
        UPDATE usuario SET id_alumno = p_id_persona WHERE id_usuario = p_id_usuario;

        -- Insertar en la tabla perfil
        INSERT INTO perfil (nombre, whatsapp, whatsapp_adulto, mail, id_alumno)
        VALUES (p_nombre, p_whatsapp, p_whatsapp_adulto, p_mail, p_id_persona);
    END IF;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `EditarCuota` (IN `p_id_cuota` INT, IN `p_id_plan` VARCHAR(10), IN `p_fecha_inicio` VARCHAR(20), IN `p_fecha_vencimiento` VARCHAR(20), IN `p_estado_pago` VARCHAR(20))   BEGIN
  UPDATE cuotas
  SET
    id_plan = COALESCE(NULLIF(p_id_plan, ''), id_plan),
    fecha_inicio = COALESCE(NULLIF(p_fecha_inicio, ''), fecha_inicio),
    fecha_vencimiento = COALESCE(NULLIF(p_fecha_vencimiento, ''), fecha_vencimiento),
    estado_pago = COALESCE(NULLIF(p_estado_pago, ''), estado_pago)
  WHERE id_cuota = p_id_cuota;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `EditarNivel` (IN `p_id_nivel` INT, IN `p_nombre` VARCHAR(100), IN `p_idioma` VARCHAR(50))   BEGIN
  UPDATE niveles
  SET nombre = p_nombre,
      idioma = p_idioma
  WHERE id_nivel = p_id_nivel;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `EditarPeriodo` (IN `p_id_periodo` INT, IN `p_nombre` VARCHAR(100))   BEGIN
    UPDATE periodos
    SET nombre = p_nombre
    WHERE id_periodo = p_id_periodo;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `EditarPlan` (IN `p_id_plan` INT, IN `p_nombre` VARCHAR(100), IN `p_descripcion` TEXT, IN `p_monto` DECIMAL(10,2))   BEGIN
  UPDATE planes
  SET nombre = COALESCE(p_nombre, nombre),
      descripcion = COALESCE(p_descripcion, descripcion),
      monto = COALESCE(p_monto, monto)
  WHERE id_plan = p_id_plan;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `editar_clase` (IN `p_id_clase` INT, IN `p_id_nivel` INT, IN `p_id_dia` INT, IN `p_id_horario` INT)   BEGIN
    -- Asegurarse de que la clase existe
    IF NOT EXISTS (SELECT 1 FROM clases WHERE id_clase = p_id_clase) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'La clase no existe';
    END IF;

    -- Actualizar la clase con los nuevos valores
    UPDATE clases
    SET id_nivel = p_id_nivel, id_dia = p_id_dia, id_horario = p_id_horario
    WHERE id_clase = p_id_clase;

    -- Mostrar el id_clase actualizado para depuración
    SELECT p_id_clase AS id_clase_actualizada;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `EliminarClase` (IN `p_id_clase` INT)   BEGIN
    -- Verificamos si la clase existe
    IF EXISTS (SELECT 1 FROM clases WHERE id_clase = p_id_clase) THEN
        -- Cambiamos la disponibilidad en lugar de eliminar
        UPDATE clases SET disponible = 0 WHERE id_clase = p_id_clase;
    ELSE
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'La clase no existe';
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `EliminarCuota` (IN `p_id_cuota` INT)   BEGIN
  DELETE FROM cuotas WHERE id_cuota = p_id_cuota;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `EliminarInscripcion` (IN `p_id_alumno` INT, IN `p_id_clase` INT)   BEGIN
    DELETE FROM clases_alumnos
    WHERE id_alumno = p_id_alumno AND id_clase = p_id_clase;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `EliminarNivel` (IN `p_id_nivel` INT)   BEGIN
  UPDATE niveles
  SET activo = 0
  WHERE id_nivel = p_id_nivel;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `EliminarPeriodo` (IN `p_id_periodo` INT)   BEGIN
    UPDATE periodos
    SET activo = 0
    WHERE id_periodo = p_id_periodo;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `EliminarPlan` (IN `p_id_plan` INT)   BEGIN
  UPDATE planes
  SET activa = FALSE
  WHERE id_plan = p_id_plan;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `InscribirAlumnoClase` (IN `p_id_alumno` INT, IN `p_id_clase` INT)   BEGIN
    INSERT INTO clases_alumnos (id_alumno, id_clase)
    VALUES (p_id_alumno, p_id_clase);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `insertar_clase` (IN `p_id_nivel` INT, IN `p_id_dia` INT, IN `p_hora_inicio` TIME, IN `p_hora_fin` TIME)   BEGIN
  IF NOT EXISTS (SELECT 1 FROM niveles WHERE id_nivel = p_id_nivel) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El id_nivel no existe';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM dias WHERE id_dia = p_id_dia) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El id_dia no existe';
  END IF;

  INSERT INTO clases (id_nivel, id_dia, hora_inicio, hora_fin)
  VALUES (p_id_nivel, p_id_dia, p_hora_inicio, p_hora_fin);

  SELECT LAST_INSERT_ID() AS id_clase_insertada;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `ObtenerAlumnosPorClase` (IN `p_id_clase` INT)   BEGIN
    SELECT 
        a.id_alumno,
        a.nombre AS nombre_alumno
    FROM clases_alumnos ca
    JOIN alumno a ON ca.id_alumno = a.id_alumno
    WHERE ca.id_clase = p_id_clase;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `ObtenerAsistenciasPorClaseYFecha` (IN `p_id_clase` INT, IN `p_fecha` DATE)   BEGIN
  SELECT 
    cu.id_alumno,
    a.nombre AS nombre_alumno,
    cu.presente
  FROM clases_usuarios cu
  JOIN alumno a ON cu.id_alumno = a.id_alumno
  WHERE cu.id_clase = p_id_clase AND cu.fecha = p_fecha;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `ObtenerAsistenciasPorFechaAlumno` (IN `p_id_alumno` INT, IN `p_fecha` DATE)   BEGIN
  SELECT 
    c.id_clase,
    d.nombre AS dia,
    n.nombre AS nivel,
    c.hora_inicio,
    c.hora_fin,
    cu.presente
  FROM clases_usuarios cu
  JOIN clases c ON cu.id_clase = c.id_clase
  JOIN niveles n ON c.id_nivel = n.id_nivel
  JOIN dias d ON c.id_dia = d.id_dia
  WHERE cu.id_alumno = p_id_alumno AND cu.fecha = p_fecha;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `ObtenerAsistenciasPorRangoAlumno` (IN `p_id_alumno` INT, IN `p_fecha_inicio` DATE, IN `p_fecha_fin` DATE)   BEGIN
  SELECT 
    COUNT(*) AS total_clases,
    SUM(presente = 1) AS total_presentes,
    SUM(presente = 0) AS total_faltas,
    ROUND(SUM(presente = 1) / COUNT(*) * 100, 2) AS porcentaje_asistencia,
    ROUND(SUM(presente = 0) / COUNT(*) * 100, 2) AS porcentaje_inasistencia
  FROM clases_usuarios
  WHERE id_alumno = p_id_alumno
    AND fecha BETWEEN p_fecha_inicio AND p_fecha_fin;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `ObtenerCategorias` ()   BEGIN
    SELECT id_tipo, nombre
    FROM tipo_nota;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `ObtenerClases` ()   BEGIN
  SELECT 
    c.id_clase,
    c.id_nivel,
    n.nombre AS nivel_nombre,
    c.id_dia,
    d.nombre AS dia_nombre,
    c.hora_inicio,
    c.hora_fin
  FROM clases c
  JOIN niveles n ON c.id_nivel = n.id_nivel
  JOIN dias d ON c.id_dia = d.id_dia
  WHERE c.disponible = 1;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `ObtenerClasesPorFecha` (IN `p_fecha` DATE)   BEGIN
  DECLARE dia_nombre VARCHAR(20);
  DECLARE dia_id INT;

  -- Obtener el nombre del día en español
  SET dia_nombre = ELT(WEEKDAY(p_fecha) + 1, 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo');

  -- Obtener el id del día desde la tabla dias
  SELECT id_dia INTO dia_id
  FROM dias
  WHERE nombre = dia_nombre
  LIMIT 1;

  -- Devolver las clases correspondientes a ese día
  SELECT 
    c.id_clase,
    d.nombre AS dia,
    n.nombre AS nivel,
    c.hora_inicio,
    c.hora_fin
  FROM clases c
  JOIN dias d ON c.id_dia = d.id_dia
  JOIN niveles n ON c.id_nivel = n.id_nivel
  WHERE c.id_dia = dia_id AND c.disponible = 1;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `ObtenerCuotas` ()   BEGIN
  SELECT c.*, a.nombre AS nombre_alumno, p.nombre AS nombre_plan
  FROM cuotas c
  JOIN alumno a ON c.id_alumno = a.id_alumno
  JOIN planes p ON c.id_plan = p.id_plan;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `ObtenerCuotasPendientes` ()   BEGIN
  SELECT c.*, a.nombre AS nombre_alumno, p.nombre AS nombre_plan
  FROM cuotas c
  JOIN alumno a ON c.id_alumno = a.id_alumno
  JOIN planes p ON c.id_plan = p.id_plan
  WHERE c.estado_pago = 'pendiente';
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `ObtenerCuotasPorAlumno` (IN `p_id_alumno` INT)   BEGIN
  SELECT c.*, p.nombre AS nombre_plan
  FROM cuotas c
  JOIN planes p ON c.id_plan = p.id_plan
  WHERE c.id_alumno = p_id_alumno;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `ObtenerCuotasPorAnio` (IN `anio` INT)   BEGIN
  SELECT 
    c.id_cuota,
    a.nombre AS nombre_alumno,
    p.nombre AS nombre_plan,
    c.fecha_inicio,
    c.fecha_vencimiento,
    c.estado_pago
  FROM cuotas c
  JOIN alumno a ON c.id_alumno = a.id_alumno
  JOIN planes p ON c.id_plan = p.id_plan
  WHERE YEAR(c.fecha_inicio) = anio;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `ObtenerCuotasPorRango` (IN `p_desde` DATE, IN `p_hasta` DATE)   BEGIN
  SELECT c.*, a.nombre AS nombre_alumno, p.nombre AS nombre_plan
  FROM cuotas c
  JOIN alumno a ON c.id_alumno = a.id_alumno
  JOIN planes p ON c.id_plan = p.id_plan
  WHERE c.fecha_inicio BETWEEN p_desde AND p_hasta;
END$$

CREATE PROCEDURE obtenerInfoPerfil(
    IN p_id_usuario INT
)
BEGIN
    SELECT 
        perfil.id_perfil,
        perfil.nombre, 
        perfil.whatsapp, 
        perfil.whatsapp_adulto,
        perfil.mail, 
        perfil.id_foto
    FROM perfil
    JOIN usuario 
        ON perfil.id_alumno = usuario.id_alumno
        OR perfil.id_profesor = usuario.id_profesor
    WHERE usuario.id_usuario = p_id_usuario
    LIMIT 1;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `ObtenerInscripciones` ()   BEGIN
    SELECT 
        ca.id_alumno, a.nombre AS nombre_alumno,
        ca.id_clase, n.nombre AS nivel, d.nombre AS dia,
        c.hora_inicio, c.hora_fin
    FROM clases_alumnos ca
    JOIN alumno a ON ca.id_alumno = a.id_alumno
    JOIN clases c ON ca.id_clase = c.id_clase
    JOIN niveles n ON c.id_nivel = n.id_nivel
    JOIN dias d ON c.id_dia = d.id_dia;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `obtenerMensajes` (IN `n_id_alumno` INT, IN `n_validation` VARCHAR(255))   BEGIN
    -- Crear tabla temporal para almacenar mensajes combinados
    CREATE TEMPORARY TABLE IF NOT EXISTS MixMensajes (
        id_mensaje INT,
        mensaje VARCHAR(255),
        createdAt DATETIME
    );

    -- Validar la acción a realizar
    IF n_validation = 'bandeja' THEN
        -- Insertar mensajes directos al alumno
        INSERT INTO MixMensajes (id_mensaje, mensaje, createdAt)
        SELECT 
            mensajes.id_mensaje, 
            mensajes.mensaje, 
            mensajes.createdAt
        FROM mensajes
        WHERE mensajes.id_alumno = n_id_alumno;

        -- Insertar mensajes dirigidos al curso
        INSERT INTO MixMensajes (id_mensaje, mensaje, createdAt)
        SELECT 
            mensajes.id_mensaje, 
            mensajes.mensaje, 
            mensajes.createdAt
        FROM mensajes
        WHERE mensajes.id_nivel = (
            SELECT alumno.id_clase 
            FROM alumno 
            WHERE alumno.id_alumno = n_id_alumno
        );

        -- Devolver los últimos 3 mensajes combinados
        SELECT *
        FROM MixMensajes
        ORDER BY createdAt DESC
        LIMIT 3;

    ELSEIF n_validation = 'todos' THEN
        -- Insertar todos los mensajes directos al alumno
        INSERT INTO MixMensajes (id_mensaje, mensaje, createdAt)
        SELECT 
            mensajes.id_mensaje, 
            mensajes.mensaje, 
            mensajes.createdAt
        FROM mensajes
        WHERE mensajes.id_alumno = n_id_alumno;

        -- Insertar todos los mensajes dirigidos al curso
        INSERT INTO MixMensajes (id_mensaje, mensaje, createdAt)
        SELECT 
            mensajes.id_mensaje, 
            mensajes.mensaje, 
            mensajes.createdAt
        FROM mensajes
        WHERE mensajes.id_nivel = (
            SELECT alumno.id_clase 
            FROM alumno 
            WHERE alumno.id_alumno = n_id_alumno
        );

        -- Devolver todos los mensajes combinados
        SELECT *
        FROM MixMensajes
        ORDER BY createdAt DESC;

    END IF;

    -- Limpiar la tabla temporal
    DROP TEMPORARY TABLE IF EXISTS MixMensajes;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `ObtenerNiveles` ()   BEGIN
  SELECT * FROM niveles WHERE activo = 1;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `ObtenerNotas` (IN `p_id_alumno` INT, IN `p_ciclo_lectivo` INT)   BEGIN
IF p_id_alumno IS NULL OR p_ciclo_lectivo IS NULL THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Parámetros inválidos';
END IF;

    SELECT 
        n.id_nota, 
        p.nombre AS periodo, 
        t.nombre AS tipo_nota, 
        n.nota 
    FROM 
        notas n
    INNER JOIN 
        periodos p ON n.id_periodo = p.id_periodo
    INNER JOIN 
        tipo_nota t ON n.id_tipo_nota = t.id_tipo
    WHERE 
        n.id_alumno = p_id_alumno AND n.ciclo_lectivo = p_ciclo_lectivo
    ORDER BY 
        p.nombre, t.nombre;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `ObtenerPeriodos` ()   BEGIN
    SELECT id_periodo, nombre
    FROM periodos WHERE activo = 1;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `ObtenerPlanes` ()   BEGIN
  SELECT * FROM planes WHERE activa = TRUE;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `ObtenerResumenAsistenciasAlumno` (IN `p_id_alumno` INT)   BEGIN
  SELECT 
    COUNT(*) AS total_clases,
    SUM(presente = 1) AS total_presentes,
    SUM(presente = 0) AS total_faltas,
    ROUND(SUM(presente = 1) / COUNT(*) * 100, 2) AS porcentaje_asistencia,
    ROUND(SUM(presente = 0) / COUNT(*) * 100, 2) AS porcentaje_inasistencia
  FROM clases_usuarios
  WHERE id_alumno = p_id_alumno;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `ObtenerTotalesAsistenciasPorClase` (IN `p_id_clase` INT)   BEGIN
  SELECT 
    cu.id_alumno,
    a.nombre AS nombre_alumno,
    COUNT(*) AS total_clases,
    SUM(cu.presente = 1) AS total_asistencias,
    SUM(cu.presente = 0) AS total_inasistencias,
    ROUND(SUM(cu.presente = 1) / COUNT(*) * 100, 2) AS porcentaje_asistencia,
    ROUND(SUM(cu.presente = 0) / COUNT(*) * 100, 2) AS porcentaje_inasistencia
  FROM clases_usuarios cu
  JOIN alumno a ON cu.id_alumno = a.id_alumno
  WHERE cu.id_clase = p_id_clase
  GROUP BY cu.id_alumno;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `ObtenerTotalesPorClaseYRango` (IN `p_id_clase` INT, IN `p_fecha_inicio` DATE, IN `p_fecha_fin` DATE)   BEGIN
  SELECT 
    cu.id_alumno,
    a.nombre AS nombre_alumno,
    COUNT(*) AS total_clases,
    SUM(cu.presente = 1) AS total_asistencias,
    SUM(cu.presente = 0) AS total_inasistencias,
    ROUND(SUM(cu.presente = 1) / COUNT(*) * 100, 2) AS porcentaje_asistencia,
    ROUND(SUM(cu.presente = 0) / COUNT(*) * 100, 2) AS porcentaje_inasistencia
  FROM clases_usuarios cu
  JOIN alumno a ON cu.id_alumno = a.id_alumno
  WHERE cu.id_clase = p_id_clase
    AND cu.fecha BETWEEN p_fecha_inicio AND p_fecha_fin
  GROUP BY cu.id_alumno;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `obtenerUsuarioPorDni` (IN `dni` INT)   BEGIN
    -- Buscar el usuario con el DNI especificado y también obtener el nombre
    SELECT 
        u.id_usuario, 
        u.id_alumno, 
        u.id_profesor, 
        u.id_rol, 
        u.password, 
        r.nombre AS rol,
        COALESCE(a.nombre, p.nombre) AS nombre_usuario -- Obtener nombre del alumno o profesor
    FROM 
        usuario u
    LEFT JOIN 
        roles r ON u.id_rol = r.id_rol
    LEFT JOIN 
        alumno a ON u.id_alumno = a.id_alumno
    LEFT JOIN 
        profesor p ON u.id_profesor = p.id_profesor
    WHERE 
        a.dni_alumno = dni OR p.dni = dni;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `obtenerUsuarios` ()   BEGIN
    SELECT id_usuario, id_alumno, id_profesor, id_rol, password FROM usuario;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `obtenerVideos` ()   SELECT * FROM videos
ORDER BY videos.id_video DESC$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `obtInformacionPerfil` (IN `n_id_alumno` INT)   SELECT formularios.nombre, formularios.whatsapp, formularios.whatsapp_adulto,formularios.mail FROM formularios JOIN alumno
ON alumno.id_alumno = n_id_alumno
WHERE formularios.nombre = alumno.nombre$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `RegistrarAsistencias` (IN `p_id_clase` INT, IN `p_fecha` DATE, IN `p_asistencias` TEXT)   BEGIN
  DECLARE entrada TEXT;
  DECLARE alumno_id INT;
  DECLARE presente_val TINYINT;
  DECLARE pos INT DEFAULT 1;
  DECLARE next_pos INT;

  WHILE pos > 0 DO
    SET next_pos = LOCATE(';', p_asistencias, pos);

    IF next_pos = 0 THEN
      SET entrada = SUBSTRING(p_asistencias, pos);
      SET pos = 0;
    ELSE
      SET entrada = SUBSTRING(p_asistencias, pos, next_pos - pos);
      SET pos = next_pos + 1;
    END IF;

    -- Parsear cada entrada "id:presente"
    SET alumno_id = SUBSTRING_INDEX(entrada, ':', 1);
    SET presente_val = SUBSTRING_INDEX(entrada, ':', -1);

    -- Insertar o actualizar
    INSERT INTO clases_usuarios (id_alumno, id_clase, fecha, presente)
    VALUES (alumno_id, p_id_clase, p_fecha, presente_val)
    ON DUPLICATE KEY UPDATE presente = presente_val;
  END WHILE;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `registrarUsuario` (IN `p_dni` INT, IN `p_password` VARCHAR(255), IN `p_nombre` VARCHAR(255))   BEGIN
    DECLARE hashedPassword VARCHAR(255);
    SET hashedPassword = p_password; 

       INSERT INTO alumno (dni_alumno, nombre, id_clase)
    VALUES (p_dni, p_nombre, NULL);


    INSERT INTO usuario (id_alumno, id_profesor, id_rol, password)
    VALUES (LAST_INSERT_ID(), NULL, 4, hashedPassword);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_obtener_estudiantes` (IN `n_opcion` VARCHAR(255))   BEGIN
    IF n_opcion = 'existente' THEN
        SELECT alumno.id_alumno, alumno.nombre 
        FROM alumno
        LEFT JOIN usuario
        ON usuario.id_rol != 4
        WHERE usuario.id_alumno = alumno.id_alumno
        ORDER BY alumno.nombre ASC;
    ELSE 
        SELECT alumno.id_alumno, alumno.nombre 
        FROM alumno
        LEFT JOIN usuario 
        ON usuario.id_alumno = alumno.id_alumno
        WHERE usuario.id_rol = 4
        ORDER BY alumno.nombre ASC;
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `subirFormulario` (IN `n_programa` VARCHAR(255), IN `n_conoce_por` VARCHAR(255), IN `n_nombre` VARCHAR(255), IN `n_dni` INT, IN `n_fecha_nacimiento` DATE, IN `n_whatsapp` VARCHAR(255), IN `n_nombre_adulto` VARCHAR(255), IN `n_whatsapp_adulto` VARCHAR(255), IN `n_calle` VARCHAR(255), IN `n_barrio` VARCHAR(255), IN `n_ciudad` VARCHAR(255), IN `n_estado_provincia` VARCHAR(255), IN `n_codigo_postal` VARCHAR(10), IN `n_mail` VARCHAR(255), IN `n_ocupacion` VARCHAR(255), IN `n_horarios_disponibles` TEXT, IN `n_nivel_estudio` VARCHAR(255), IN `n_pago` VARCHAR(255), IN `n_afeccion` TEXT, IN `n_id_usuario` INT)   INSERT INTO formularios (
        programa, conoce_por, nombre, dni,  fecha_nacimiento, whatsapp,
        nombre_adulto,  whatsapp_adulto, calle, barrio, ciudad,
        estado_provincia, codigo_postal, mail, ocupacion, horarios_disponibles,
        nivel_estudio, pago, afeccion, id_usuario
    )
    VALUES (
        n_programa, n_conoce_por, n_nombre, n_dni, n_fecha_nacimiento, n_whatsapp,
        n_nombre_adulto, n_whatsapp_adulto, n_calle, n_barrio, n_ciudad,
        n_estado_provincia, n_codigo_postal, n_mail, n_ocupacion, n_horarios_disponibles,
        n_nivel_estudio, n_pago, n_afeccion, n_id_usuario
    )$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `SubirMensaje` (IN `n_id_alumno` INT, IN `n_mensaje` VARCHAR(255))   BEGIN
    IF n_mensaje IS NULL OR n_mensaje = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El mensaje no puede estar vacío';
    END IF;

    INSERT INTO mensajes (id_alumno, mensaje, createdAt)
    VALUES (n_id_alumno, n_mensaje, CURRENT_TIMESTAMP);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `SubirMensajeClase` (IN `p_id_clase` INT, IN `p_mensaje` VARCHAR(255))   BEGIN
  IF p_mensaje IS NULL OR p_mensaje = '' THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'El mensaje no puede estar vacío';
  END IF;

  -- Obtener todos los alumnos de la clase
  INSERT INTO mensajes (id_alumno, mensaje, createdAt)
  SELECT ca.id_alumno, p_mensaje, NOW()
  FROM clases_alumnos ca
  WHERE ca.id_clase = p_id_clase;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `SubirMensajeCurso` (IN `n_id_nivel` INT, IN `n_mensaje` VARCHAR(255))   BEGIN
    IF n_mensaje IS NULL OR n_mensaje = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El mensaje no puede estar vacío';
    END IF;

    INSERT INTO mensajes (id_nivel, mensaje, createdAt)
    VALUES (n_id_nivel, n_mensaje, CURRENT_TIMESTAMP);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `SubirMensajeTodos` (IN `n_mensaje` TEXT)   BEGIN
    INSERT INTO mensajes (mensaje, id_alumno, id_nivel, createdAt)
    VALUES (n_mensaje, NULL, NULL, NOW());
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `SubirNota` (IN `p_id_alumno` INT, IN `p_id_periodo` INT, IN `p_id_tipo_nota` INT, IN `p_nota` DECIMAL(5,2), IN `p_ciclo_lectivo` INT)   BEGIN
    -- Verificar si ya existe una nota para el mismo alumno, periodo, tipo de nota y ciclo lectivo
    IF EXISTS (
        SELECT 1 
        FROM notas 
        WHERE id_alumno = p_id_alumno 
          AND id_periodo = p_id_periodo 
          AND id_tipo_nota = p_id_tipo_nota 
          AND ciclo_lectivo = p_ciclo_lectivo
    ) THEN
        -- Si existe, actualizar la nota
        UPDATE notas
        SET nota = p_nota
        WHERE id_alumno = p_id_alumno 
          AND id_periodo = p_id_periodo 
          AND id_tipo_nota = p_id_tipo_nota 
          AND ciclo_lectivo = p_ciclo_lectivo;
    ELSE
        -- Si no existe, insertar la nueva nota
        INSERT INTO notas (id_alumno, id_periodo, id_tipo_nota, nota, ciclo_lectivo)
        VALUES (p_id_alumno, p_id_periodo, p_id_tipo_nota, p_nota, p_ciclo_lectivo);
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `subirVideo` (IN `n_titulo` VARCHAR(255), IN `n_idioma` VARCHAR(255), IN `n_url` VARCHAR(255))   INSERT INTO videos(titulo,idioma,url)
VALUES (n_titulo, n_idioma, n_url)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `VerificarCuotasVigentes` (IN `p_id_alumno` INT, IN `p_fecha` DATE)   BEGIN
    -- Declarar variable para contar resultados
    DECLARE v_count INT DEFAULT 0;
    
    -- Contar cuotas vigentes
    SELECT COUNT(*) INTO v_count
    FROM cuotas
    WHERE id_alumno = p_id_alumno
    AND p_fecha BETWEEN fecha_inicio AND fecha_vencimiento;
    
    -- Si hay cuotas vigentes, devolver los datos
    IF v_count > 0 THEN
        SELECT 
            c.id_cuota,
            c.id_alumno,
            a.nombre AS nombre_alumno,
            c.id_plan,
            p.nombre AS nombre_plan,
            p.monto,
            c.fecha_inicio,
            c.fecha_vencimiento,
            c.estado_pago,
            DATEDIFF(c.fecha_vencimiento, p_fecha) AS dias_restantes,
            'success' AS status
        FROM 
            cuotas c
        JOIN 
            alumno a ON c.id_alumno = a.id_alumno
        JOIN 
            planes p ON c.id_plan = p.id_plan
        WHERE 
            c.id_alumno = p_id_alumno
            AND p_fecha BETWEEN c.fecha_inicio AND c.fecha_vencimiento
        LIMIT 1;
    ELSE
        -- Si no hay cuotas vigentes, devolver mensaje
        SELECT 
            CONCAT('El alumno con ID ', p_id_alumno, 
                   ' no tiene cuotas vigentes para la fecha ', 
                   DATE_FORMAT(p_fecha, '%Y-%m-%d')) AS mensaje,
            'not_found' AS status;
    END IF;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `alumno`
--

CREATE TABLE `alumno` (
  `id_alumno` int(11) NOT NULL,
  `dni_alumno` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `id_clase` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `alumno`
--

INSERT INTO `alumno` (`id_alumno`, `dni_alumno`, `nombre`, `id_clase`) VALUES
(2, 41991328, 'Sol Vega', NULL),
(3, 41717495, 'Ivo Moni', NULL),
(24, 45324575, 'Barbara', NULL),
(25, 12564352, 'Federico Varela', NULL),
(26, 12123456, 'Jorge', NULL),
(27, 70100200, 'Jorge 2', NULL),
(29, 4803558, 'valentino catania', NULL),
(30, 10123456, 'Lautaro Andrés ', NULL),
(31, 47159461, 'Luisi Coria', NULL),
(32, 46411411, 'Luisiana Cori', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `asistencia`
--

CREATE TABLE `asistencia` (
  `id_asistencia` int(11) NOT NULL,
  `id_alumno` int(11) NOT NULL,
  `cantidad_faltas` int(11) NOT NULL,
  `cantidad_ausentes` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `clases`
--

CREATE TABLE `clases` (
  `id_clase` int(11) NOT NULL,
  `id_nivel` int(11) NOT NULL,
  `id_dia` int(11) NOT NULL,
  `hora_inicio` time DEFAULT NULL,
  `hora_fin` time DEFAULT NULL,
  `disponible` tinyint(1) NOT NULL DEFAULT 1,
  `cupo_maximo` int(11) DEFAULT 9
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `clases`
--

INSERT INTO `clases` (`id_clase`, `id_nivel`, `id_dia`, `hora_inicio`, `hora_fin`, `disponible`, `cupo_maximo`) VALUES
(1, 2, 3, '11:00:00', '12:30:00', 0, 9),
(2, 1, 1, '00:00:00', '13:30:00', 0, 9),
(3, 2, 3, '09:00:00', '10:00:00', 1, 9),
(4, 5, 2, '09:00:00', '11:30:00', 0, 9),
(5, 1, 1, '09:00:00', '10:00:00', 1, 9),
(6, 3, 1, '10:00:00', '11:00:00', 1, 9);

-- --------------------------------------------------------

--
-- Table structure for table `clases_alumnos`
--

CREATE TABLE `clases_alumnos` (
  `id_alumno` int(11) NOT NULL,
  `id_clase` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `clases_alumnos`
--

INSERT INTO `clases_alumnos` (`id_alumno`, `id_clase`) VALUES
(2, 1),
(2, 3),
(2, 5),
(3, 2),
(24, 3),
(24, 5),
(25, 5),
(26, 5),
(29, 3),
(30, 3),
(30, 5);

-- --------------------------------------------------------

--
-- Table structure for table `clases_usuarios`
--

CREATE TABLE `clases_usuarios` (
  `id_alumno` int(11) NOT NULL,
  `id_clase` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `presente` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `clases_usuarios`
--

INSERT INTO `clases_usuarios` (`id_alumno`, `id_clase`, `fecha`, `presente`) VALUES
(2, 3, '2025-06-04', 1),
(2, 3, '2025-06-11', 1),
(2, 3, '2025-06-18', 1),
(2, 5, '2025-06-16', 1),
(24, 3, '2025-06-04', 1),
(24, 3, '2025-06-11', 1),
(24, 3, '2025-06-18', 0),
(24, 5, '2025-06-16', 0),
(25, 5, '2025-06-16', 1),
(29, 3, '2025-06-04', 1),
(29, 3, '2025-06-11', 1),
(29, 3, '2025-06-18', 1),
(30, 3, '2025-06-04', 1),
(30, 3, '2025-06-11', 0),
(30, 3, '2025-06-18', 1),
(30, 5, '2025-06-16', 1);

-- --------------------------------------------------------

--
-- Table structure for table `cuotas`
--

CREATE TABLE `cuotas` (
  `id_cuota` int(11) NOT NULL,
  `id_alumno` int(11) NOT NULL,
  `id_plan` int(11) NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_vencimiento` date NOT NULL,
  `estado_pago` enum('pendiente','paga','vencida') DEFAULT 'pendiente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cuotas`
--

INSERT INTO `cuotas` (`id_cuota`, `id_alumno`, `id_plan`, `fecha_inicio`, `fecha_vencimiento`, `estado_pago`) VALUES
(2, 3, 2, '2025-06-01', '2025-06-30', 'paga'),
(7, 24, 2, '2025-06-01', '2025-06-30', 'paga');

-- --------------------------------------------------------

--
-- Table structure for table `dias`
--

CREATE TABLE `dias` (
  `id_dia` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `dias`
--

INSERT INTO `dias` (`id_dia`, `nombre`) VALUES
(1, 'Lunes'),
(2, 'Martes'),
(3, 'Miercoles'),
(4, 'Jueves'),
(5, 'Viernes');

-- --------------------------------------------------------

--
-- Table structure for table `formularios`
--

CREATE TABLE `formularios` (
  `id_formulario` int(11) NOT NULL,
  `programa` varchar(255) NOT NULL,
  `conoce_por` varchar(255) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `dni` int(11) NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `whatsapp` varchar(255) NOT NULL,
  `nombre_adulto` varchar(255) DEFAULT NULL,
  `whatsapp_adulto` varchar(255) DEFAULT NULL,
  `calle` varchar(255) NOT NULL,
  `barrio` varchar(255) NOT NULL,
  `ciudad` varchar(255) NOT NULL,
  `estado_provincia` varchar(255) NOT NULL,
  `codigo_postal` int(11) NOT NULL,
  `mail` varchar(255) NOT NULL,
  `ocupacion` varchar(255) NOT NULL,
  `horarios_disponibles` varchar(255) NOT NULL,
  `nivel_estudio` varchar(255) NOT NULL,
  `pago` varchar(255) NOT NULL,
  `afeccion` varchar(255) DEFAULT NULL,
  `id_usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `formularios`
--

INSERT INTO `formularios` (`id_formulario`, `programa`, `conoce_por`, `nombre`, `dni`, `fecha_nacimiento`, `whatsapp`, `nombre_adulto`, `whatsapp_adulto`, `calle`, `barrio`, `ciudad`, `estado_provincia`, `codigo_postal`, `mail`, `ocupacion`, `horarios_disponibles`, `nivel_estudio`, `pago`, `afeccion`, `id_usuario`) VALUES
(1, 'Ingles interactivo para adultos', 'Facebook', 'a', 0, '2025-01-10', '232425252', 'c', '0', '32223250', 'e', 'f', 'g', 0, 'i', 'j@gmail.com', 'Ambas', 'de mañana hasta ayer', 'Básico', 'Transferencia', 0),
(2, 'Portugues chat', 'Poster o Flyer', 'Lautaro', 0, '2025-01-10', '2147483647', 'Mi', '0', '2364231920', 'al fondo derecho', 'el de aca', 'lt', 0, 'nose', 'hotmail@gmail.com', 'Estudio', 'siempre', 'Avanzado', 'Efectivo', 0),
(3, 'Portugues chat', 'Poster o Flyer', 'Lautaro', 0, '2025-01-10', '2147483647', 'Mi', '2147483647', 'al fondo derecho', 'el de aca', 'lt', 'el mismo que el tuyo', 0, 'hotmail@gmail.com', 'Estudio', 'siempre', 'Avanzado', 'Efectivo', 'todas juntas', 0),
(4, 'Portugues chat', 'Poster o Flyer', 'Lautaro', 0, '2025-01-10', '2147483647', 'Mi', '2147483647', 'al fondo derecho', 'el de aca', 'lt', 'el mismo que el tuyo', 59, 'hotmail@gmail.com', 'Estudio', 'siempre', 'Avanzado', 'Efectivo', 'todas juntas', 0),
(5, 'Portugues chat', 'Poster o Flyer', 'Lautaro', 0, '2025-01-10', '2147483647', 'Mi', '2147483647', 'al fondo derecho', 'el de aca', 'lt', 'el mismo que el tuyo', 59, 'hotmail@gmail.com', 'Estudio', 'siempre', 'Avanzado', 'Efectivo', 'todas juntas', 0),
(6, 'Portugues chat', 'Poster o Flyer', 'Lautaro', 0, '2025-01-10', '2147483647', 'Mi', '2147483647', 'al fondo derecho', 'el de aca', 'lt', 'el mismo que el tuyo', 59, 'hotmail@gmail.com', 'Estudio', 'siempre', 'Avanzado', 'Efectivo', 'todas juntas', 0),
(7, 'Portugues chat', 'Poster o Flyer', 'Lautaro', 0, '2025-01-10', '2147483647', 'Mi', '2147483647', 'al fondo derecho', 'el de aca', 'lt', 'el mismo que el tuyo', 59, 'hotmail@gmail.com', 'Estudio', 'siempre', 'Avanzado', 'Efectivo', 'todas juntas', 0),
(8, 'programa1', 'Facebook', 'Juan', 0, '2000-01-01', '1234567890', 'Pedro', '987654321', 'Av. Siempre Viva', 'Springfield', 'Capital', 'Estado', 12345, 'juan@mail.com', 'Trabajo', '8am a 4pm', 'Básico', 'Efectivo', 'Sin afecciones', 0),
(9, 'Portugues chat', 'Poster o Flyer', 'Lautaro', 0, '2025-01-10', '2147483647', 'Mi', '2147483647', 'al fondo derecho', 'el de aca', 'lt', 'el mismo que el tuyo', 59, 'hotmail@gmail.com', 'Estudio', 'siempre', 'Avanzado', 'Efectivo', 'todas juntas', 0),
(10, 'Portugues chat', 'Poster o Flyer', 'Lautaro', 0, '2025-01-10', '2147483647', 'Mi', '2147483647', 'al fondo derecho', 'el de aca', 'lt', 'el mismo que el tuyo', 59, 'hotmail@gmail.com', 'Estudio', 'siempre', 'Avanzado', 'Efectivo', 'todas juntas', 0),
(11, 'Portugues chat', 'Poster o Flyer', 'Lautaro', 0, '2025-01-10', '654321', 'Mi', '123456', 'al fondo derecho', 'el de aca', 'lt', 'el mismo que el tuyo', 59, 'hotmail@gmail.com', 'Estudio', 'siempre', 'Avanzado', 'Efectivo', 'ninguna soy cra', 0),
(12, 'Portugues chat', 'Poster o Flyer', 'Lautaro', 0, '2025-01-10', '2147483647', 'Mi', '123456', 'al fondo derecho', 'el de aca', 'lt', 'el mismo que el tuyo', 59, 'hotmail@gmail.com', 'Estudio', 'siempre', 'Avanzado', 'Efectivo', 'ninguna soy cra', 0),
(13, 'Portugues chat', 'Poster o Flyer', 'Lautaro', 0, '2025-01-10', '235569231', 'Mi', '123456', 'al fondo derecho', 'el de aca', 'lt', 'el mismo que el tuyo', 59, 'hotmail@gmail.com', 'Estudio', 'siempre', 'Avanzado', 'Efectivo', 'ninguna soy cra', 0),
(14, 'Portugues chat', 'Poster o Flyer', 'Lautaro', 0, '2025-01-10', '2147483647', 'Mi', '123456789', 'al fondo derecho', 'el de aca', 'lt', 'el mismo que el tuyo', 59, 'hotmail@gmail.com', 'Estudio', 'siempre', 'Avanzado', 'Efectivo', 'ninguna soy cra', 0),
(15, 'Portugues chat', 'Poster o Flyer', 'Lautaro', 0, '2025-01-10', '02355692320', 'Mi', '0123456789', 'al fondo derecho', 'el de aca', 'lt', 'el mismo que el tuyo', 59, 'hotmail@gmail.com', 'Estudio', 'siempre', 'Avanzado', 'Efectivo', 'ninguna soy cra', 0),
(16, 'Portugues chat', 'Poster o Flyer', 'Lautaro', 0, '2025-01-10', '02355692320', 'Mi', '0123456789', 'al fondo derecho', 'el de aca', 'lt', 'el mismo que el tuyo', 59, 'hotmail@gmail.com', 'Estudio', 'siempre', 'Avanzado', 'Efectivo', 'ninguna soy cra', 0),
(17, 'Portugues Universitario', 'Recomendacion', 'Lauti', 0, '2025-01-04', '2355691009', '', '', 'Calle 123', '', 'L T', 'BS AS', 6014, 'lauti@gmail.com', 'Ambas', 'ahora', 'Básico', 'Efectivo', 'ninguna', 0),
(18, 'Portugues Tecnico', 'Recomendacion', 'lau', 0, '2025-01-03', '21341240', '', '', 'Calle 32', '', 'L T', 'BS AS', 6015, 'lau@gmail.com', 'Estudio', 'ninguno', 'Avanzado', 'Otro Medio de pago', 'todas juntas', 0),
(19, '', '', '', 0, '0000-00-00', '', '', '', '', '', '', '', 0, '', '', '', '', '', 'a', 0),
(20, 'Portugues academico cursos regulares(a partir de los 4 años)', 'Pagina Web', 'a', 0, '2025-01-10', '', '', '12314', 'a', 'a', 'a', 'a', 62, 'a@gmail.com', 'Estudio', 'a', 'Intermedio', 'Acordar encuentros', 'a', 0),
(21, '', '', '', 0, '0000-00-00', '', '', '', '', '', '', '', 0, '', '', '', '', '', '', 0),
(22, 'Ingles Universitario', 'Pagina Web', 'a', 0, '2025-01-18', '22323', '', '', 'asd 1', 'no', 'asdas', 'asdsad', 530, 'hola@gmail.com', 'Ambas', 'no', 'Avanzado', '', 'a', 0),
(23, 'Ingles Universitario', 'Pagina Web', 'a', 0, '2025-01-18', '22323', '', '', 'asd 1', 'no', 'asdas', 'asdsad', 530, 'hola@gmail.com', 'Ambas', 'no', 'Avanzado', 'Otro Medio de pago', 'a', 0),
(24, 'Ingles Universitario', 'Pagina Web', 'a', 0, '2025-01-18', '22323', '', '', 'asd 1', 'no', 'asdas', 'asdsad', 530, 'hola@gmail.com', 'Ambas', 'no', 'Avanzado', 'Otro Medio de pago', 'a', 0),
(25, 'Ingles Universitario', 'Pagina Web', 'a', 0, '2025-01-18', '22323', '', '', 'asd 1', 'no', 'asdas', 'asdsad', 530, 'hola@gmail.com', 'Ambas', 'no', 'Avanzado', 'Otro Medio de pago', 'a', 0),
(26, 'Ingles Universitario', 'Pagina Web', 'a', 0, '2025-01-18', '22323', '', '', 'asd 1', 'no', 'asdas', 'asdsad', 530, 'hola@gmail.com', 'Ambas', 'no', 'Avanzado', 'Otro Medio de pago', 'a', 0),
(27, 'Ingles Universitario', 'Pagina Web', 'Lauti', 0, '2025-01-18', '22323', '', '', 'asd 1', 'no', 'asdas', 'asdsad', 530, 'hola@gmail.com', 'Ambas', 'no', 'Avanzado', 'Otro Medio de pago', 'a', 0),
(28, 'Ingles Universitario', 'Pagina Web', 'Lauti', 0, '2025-01-18', '22323', '', '', 'asd 1', 'no', 'asdas', 'asdsad', 530, 'hola@gmail.com', 'Ambas', 'no', 'Avanzado', 'Otro Medio de pago', 'a', 0),
(29, 'Ingles Universitario', 'Pagina Web', 'Lauti', 0, '2025-01-18', '22323', '', '', 'asd 1', 'no', 'asdas', 'asdsad', 530, 'hola@gmail.com', 'Ambas', 'no', 'Avanzado', 'Otro Medio de pago', 'a', 0),
(30, 'Ingles Universitario', 'Pagina Web', 'Lauti', 0, '2025-01-18', '22323', '', '', 'asd 1', 'no', 'asdas', 'asdsad', 530, 'hola@gmail.com', 'Ambas', 'no', 'Avanzado', 'Otro Medio de pago', 'a', 0),
(31, 'Ingles Universitario', 'Pagina Web', 'Lauti', 0, '2025-01-18', '22323', '', '', 'asd 1', 'no', 'asdas', 'asdsad', 530, 'hola@gmail.com', 'Ambas', 'no', 'Avanzado', 'Otro Medio de pago', 'a', 0),
(32, 'Ingles Universitario', 'Recomendacion', 'lorenzo', 0, '2009-02-17', '2355460017', '', '', 'Rawson 1030', '', 'Los Toldos', 'Buenos Aires', 6015, 'lorenzo10coria@gmail.com', 'Ambas', '8:00 AM - 10:00 AM, 13:00 - 15:00 ', 'Básico', 'Transferencia/Billetera Virtual', 'Dengue', 0),
(33, 'Portugues academico cursos regulares(a partir de los 4 años)', 'Facebook', 'Sol', 0, '2025-01-02', '232321413', '', '592423', '', '', '', '', 0, 'solsv7@gmail.com', 'Ambas', 'ninguno', 'Avanzado', 'Efectivo', 'todas', 0),
(34, 'Portugues Tecnico', 'Poster o Flyer', 'Sol Vega', 0, '2025-01-08', '23232332', '', '', 'nose', '', 'Los Toldos', 'Buenos Aires (Provincia)', 6000, 'solsv7@gmail.com', 'Ambas', 'todos', 'Avanzado', 'Otro Medio de pago', 'tranqui', 0);

-- --------------------------------------------------------

--
-- Table structure for table `mensajes`
--

CREATE TABLE `mensajes` (
  `id_mensaje` int(11) NOT NULL,
  `id_alumno` int(11) DEFAULT NULL,
  `mensaje` varchar(255) NOT NULL,
  `id_nivel` int(11) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mensajes`
--

INSERT INTO `mensajes` (`id_mensaje`, `id_alumno`, `mensaje`, `id_nivel`, `createdAt`) VALUES
(1, 0, 'hola', 0, NULL),
(2, 0, 'segundo aviso', 0, NULL),
(3, 0, 'Hola2\n', 0, NULL),
(4, 0, 'Hola3\n', 0, NULL),
(5, 25, 'prueba 1\n', 0, NULL),
(6, 2, 'prueba 2\n', 0, NULL),
(7, 2, 'prueba 6', NULL, NULL),
(11, NULL, 'La cuota aumentara a $15.000 el mes que viene', 1, NULL),
(12, 2, 'La cuota aumentara a $15.000 el mes que viene', NULL, NULL),
(13, 2, 'prueba timestamps', NULL, '2025-01-10 03:00:00'),
(15, 2, 'Mensaje 2\n', NULL, '2025-01-10 03:00:00'),
(18, NULL, 'mensaje para curso a1', 1, '2025-01-11 03:00:00'),
(19, 2, 'mensaje de prueba', NULL, '2025-01-11 03:00:00'),
(21, 2, 'gajgag', NULL, '2025-01-11 03:00:00'),
(22, NULL, 'holaaa curso A1', 1, '2025-01-12 03:00:00'),
(24, NULL, 'aaaa1', 1, '2025-01-12 03:00:00'),
(25, NULL, 'aaaa2\n', 1, '2025-01-12 03:00:00'),
(26, NULL, 'aaaa3\n', 1, '2025-01-12 03:00:00'),
(27, 2, 'aaaaaaaaaaaaaaaaaaaa\n', NULL, '2025-01-12 03:00:00'),
(28, 2, 'bbbbbbbbbbbbbbbb', NULL, '2025-01-12 03:00:00'),
(30, 2, 'Mensaje para sol vega', NULL, '2025-01-14 03:00:00'),
(31, NULL, 'Mensaje para todo el curso A1', 1, '2025-01-14 03:00:00'),
(32, NULL, 'Segundo mensaje para curso A1', 1, '2025-01-14 03:00:00'),
(33, 27, 'hola jorge2 cambiate el nombre', NULL, '2025-01-14 03:00:00'),
(34, 2, 'sol', NULL, '2025-01-14 03:00:00'),
(35, 2, 'Primer mensaje para sol', NULL, '2025-01-14 13:48:14'),
(36, NULL, 'mensaje para todo el curso', 1, '2025-01-14 13:48:26'),
(37, 2, 'ultimo mensaje para sol', NULL, '2025-01-14 13:48:43'),
(38, 2, 'Mensaje para sol prueba 8000', NULL, '2025-01-14 17:39:06'),
(39, NULL, 'Mensaje para el curso, la cuota sale 10 millones', 1, '2025-01-14 17:39:34'),
(40, 2, 'como era el vervo tu vi', NULL, '2025-01-15 20:35:00'),
(41, NULL, 'nuevo aviso', 1, '2025-01-24 19:31:46'),
(42, NULL, 'Holaa', 1, '2025-01-24 19:33:57'),
(43, NULL, 'Otro aviso al curso', 1, '2025-01-24 19:34:11'),
(44, 2, 'prueba ', NULL, '2025-02-19 21:32:07'),
(45, 2, 'aviso', NULL, '2025-02-19 22:02:05'),
(46, 2, 'debes una tarea', NULL, '2025-02-19 22:41:59'),
(47, 2, 'sube la cuota 1000', NULL, '2025-02-20 19:20:09'),
(48, 2, 'te sacaste un 2', NULL, '2025-03-14 14:23:03'),
(49, 2, 'Este es un aviso de prueba para todos los alumnos de la clase 3.', NULL, '2025-06-19 20:14:47'),
(50, 24, 'Este es un aviso de prueba para todos los alumnos de la clase 3.', NULL, '2025-06-19 20:14:47'),
(51, 29, 'Este es un aviso de prueba para todos los alumnos de la clase 3.', NULL, '2025-06-19 20:14:47'),
(52, 30, 'Este es un aviso de prueba para todos los alumnos de la clase 3.', NULL, '2025-06-19 20:14:47'),
(56, 2, 'Clase miercoles ', NULL, '2025-06-19 20:15:44'),
(57, 24, 'Clase miercoles ', NULL, '2025-06-19 20:15:44'),
(58, 29, 'Clase miercoles ', NULL, '2025-06-19 20:15:44'),
(59, 30, 'Clase miercoles ', NULL, '2025-06-19 20:15:44'),
(63, 2, 'holaaa', NULL, '2025-06-19 20:23:37');

-- --------------------------------------------------------

--
-- Table structure for table `niveles`
--

CREATE TABLE `niveles` (
  `id_nivel` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `activo` tinyint(1) DEFAULT 1,
  `idioma` varchar(50) DEFAULT 'Inglés'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `niveles`
--

INSERT INTO `niveles` (`id_nivel`, `nombre`, `activo`, `idioma`) VALUES
(1, 'A1 - Beginner', 1, 'Inglés'),
(2, 'A2 - Elementary', 1, 'Inglés'),
(3, 'B1 - Intermediate', 1, 'Inglés'),
(4, 'B2 - Upper Intermediate', 1, 'Inglés'),
(5, 'C1 - Advanced', 1, 'Inglés'),
(6, 'C2 - Proficient', 1, 'Inglés'),
(7, 'B1', 0, 'Portugués'),
(8, 'A2', 0, 'Portugués'),
(9, 'A1', 1, 'Portugués');

-- --------------------------------------------------------

--
-- Table structure for table `notas`
--

CREATE TABLE `notas` (
  `id_nota` int(11) NOT NULL,
  `id_alumno` int(11) NOT NULL,
  `id_periodo` int(11) NOT NULL,
  `id_tipo_nota` int(11) NOT NULL,
  `nota` decimal(5,2) NOT NULL,
  `ciclo_lectivo` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notas`
--

INSERT INTO `notas` (`id_nota`, `id_alumno`, `id_periodo`, `id_tipo_nota`, `nota`, `ciclo_lectivo`) VALUES
(1, 2, 1, 1, 10.00, 2024),
(2, 2, 2, 1, 6.00, 2024),
(3, 2, 2, 1, 6.00, 2024),
(4, 2, 1, 2, 10.00, 2024),
(5, 2, 1, 3, 10.00, 2024),
(6, 2, 1, 4, 10.00, 2024),
(7, 2, 1, 5, 10.00, 2024),
(8, 2, 3, 1, 8.00, 2024),
(9, 2, 4, 1, 1.00, 2024),
(10, 2, 2, 2, 7.00, 2024),
(11, 2, 2, 3, 8.00, 2024),
(12, 2, 2, 4, 9.00, 2024),
(13, 2, 2, 5, 10.00, 2024),
(14, 2, 3, 2, 8.00, 2024),
(15, 2, 3, 3, 8.00, 2024),
(16, 2, 3, 4, 9.00, 2024),
(17, 2, 3, 5, 9.00, 2024),
(18, 2, 4, 2, 9.00, 2024),
(19, 2, 4, 3, 9.00, 2024),
(20, 2, 4, 4, 9.00, 2024),
(21, 2, 4, 5, 9.00, 2025),
(22, 24, 1, 1, 10.00, 2025),
(23, 3, 1, 1, 8.00, 2025),
(24, 24, 1, 2, 9.00, 2025),
(25, 25, 1, 1, 9.00, 2025),
(26, 25, 1, 2, 9.00, 0),
(27, 24, 2, 5, 8.00, 0),
(28, 24, 2, 1, 6.00, 0),
(29, 24, 2, 2, 7.00, 0),
(30, 24, 2, 3, 8.00, 0),
(31, 24, 2, 4, 10.00, 0),
(32, 24, 2, 5, 10.00, 0),
(33, 24, 2, 1, 6.00, 0),
(34, 24, 2, 2, 7.00, 0),
(35, 24, 2, 3, 8.00, 0),
(36, 24, 2, 4, 10.00, 0),
(37, 24, 2, 5, 10.00, 0),
(38, 24, 1, 1, 8.00, 0),
(39, 24, 1, 2, 9.00, 0),
(40, 24, 1, 3, 10.00, 0),
(41, 24, 1, 4, 7.00, 0),
(42, 24, 1, 5, 6.00, 0),
(43, 2, 1, 1, 5.50, 0),
(44, 2, 1, 1, 9.99, 0),
(45, 26, 1, 1, 10.00, 0),
(46, 26, 1, 2, 10.00, 0),
(47, 26, 1, 3, 10.00, 0),
(48, 26, 1, 4, 10.00, 0),
(49, 26, 1, 5, 10.00, 0),
(50, 26, 2, 5, 10.00, 0),
(51, 26, 2, 4, 10.00, 0),
(52, 26, 2, 3, 10.00, 0),
(53, 26, 2, 2, 10.00, 0),
(54, 26, 2, 1, 10.00, 0),
(55, 26, 3, 1, 10.00, 0),
(56, 26, 3, 2, 10.00, 0),
(57, 26, 3, 3, 10.00, 0),
(58, 26, 3, 4, 10.00, 0),
(59, 26, 3, 5, 10.00, 0),
(60, 26, 4, 1, 10.00, 0),
(61, 26, 4, 2, 10.00, 0),
(62, 26, 4, 3, 10.00, 0),
(63, 26, 4, 4, 10.00, 0),
(64, 26, 4, 5, 10.00, 0),
(65, 2, 1, 1, 3.00, 0),
(66, 2, 2, 1, 1.50, 0),
(67, 2, 3, 1, 5.80, 0),
(68, 2, 4, 1, 1.10, 0),
(69, 2, 1, 1, 6.00, 0),
(70, 2, 2, 1, 9.00, 0),
(71, 2, 3, 1, 3.00, 0),
(72, 2, 4, 1, 34.00, 0),
(73, 2, 1, 1, 3.00, 0),
(74, 2, 1, 2, 3.00, 0),
(75, 2, 1, 3, 3.00, 0),
(76, 2, 1, 4, 3.00, 0),
(77, 2, 1, 5, 3.00, 0),
(78, 2, 2, 1, 4.00, 0),
(79, 2, 2, 2, 4.00, 0),
(80, 2, 2, 3, 4.00, 0),
(81, 2, 2, 4, 4.00, 0),
(82, 2, 2, 5, 4.00, 0),
(83, 2, 3, 1, 5.00, 0),
(84, 2, 3, 2, 5.00, 0),
(85, 2, 3, 3, 5.00, 0),
(86, 2, 3, 4, 5.00, 0),
(87, 2, 3, 5, 5.00, 0),
(88, 2, 4, 1, 6.00, 0),
(89, 2, 4, 2, 6.00, 0),
(90, 2, 4, 3, 6.00, 0),
(91, 2, 4, 4, 6.00, 0),
(92, 2, 4, 5, 6.00, 0),
(93, 26, 1, 1, 5.00, 0),
(94, 26, 1, 2, 5.00, 0),
(95, 26, 1, 3, 5.00, 0),
(96, 26, 1, 4, 5.00, 0),
(97, 26, 1, 5, 5.00, 0),
(98, 26, 2, 1, 5.00, 0),
(99, 26, 3, 1, 5.00, 0),
(100, 26, 4, 1, 5.00, 0),
(101, 26, 3, 3, 5.00, 0),
(102, 26, 2, 4, 5.00, 0),
(103, 26, 2, 5, 5.00, 0),
(104, 26, 2, 3, 5.00, 0),
(105, 26, 2, 2, 5.00, 0),
(106, 26, 3, 2, 5.00, 0),
(107, 26, 4, 2, 5.00, 0),
(108, 26, 4, 3, 5.00, 0),
(109, 26, 4, 4, 5.00, 0),
(110, 26, 3, 4, 5.00, 0),
(111, 26, 3, 5, 5.00, 0),
(112, 26, 4, 5, 5.00, 0),
(113, 26, 1, 1, 1.00, 0),
(114, 26, 1, 2, 1.00, 0),
(115, 26, 1, 3, 1.00, 0),
(116, 26, 1, 4, 1.00, 0),
(117, 26, 1, 5, 1.00, 0),
(118, 26, 2, 1, 1.00, 0),
(119, 26, 2, 2, 1.00, 0),
(120, 26, 2, 3, 1.00, 0),
(121, 26, 2, 4, 1.00, 0),
(122, 26, 2, 5, 1.00, 0),
(123, 26, 3, 5, 1.00, 0),
(124, 26, 3, 4, 1.00, 0),
(125, 26, 3, 3, 1.00, 0),
(126, 26, 3, 2, 1.00, 0),
(127, 26, 3, 1, 1.00, 0),
(128, 26, 4, 1, 1.00, 0),
(129, 26, 4, 2, 1.00, 0),
(130, 26, 4, 3, 1.00, 0),
(131, 26, 4, 4, 1.00, 0),
(132, 26, 4, 5, 1.00, 0),
(133, 26, 1, 1, 1.00, 0),
(134, 26, 1, 2, 1.00, 0),
(135, 26, 1, 3, 1.00, 0),
(136, 26, 1, 4, 1.00, 0),
(137, 26, 1, 5, 1.00, 0),
(138, 26, 2, 1, 1.00, 0),
(139, 26, 2, 2, 1.00, 0),
(140, 26, 2, 3, 1.00, 0),
(141, 26, 2, 4, 1.00, 0),
(142, 26, 2, 5, 1.00, 0),
(143, 26, 3, 5, 1.00, 0),
(144, 26, 3, 4, 1.00, 0),
(145, 26, 3, 3, 1.00, 0),
(146, 26, 3, 2, 1.00, 0),
(147, 26, 3, 1, 1.00, 0),
(148, 26, 4, 1, 1.00, 0),
(149, 26, 4, 2, 1.00, 0),
(150, 26, 4, 3, 1.00, 0),
(151, 26, 4, 4, 1.00, 0),
(152, 26, 4, 5, 1.00, 0),
(153, 26, 1, 1, 1.00, 0),
(154, 26, 1, 2, 1.00, 0),
(155, 26, 1, 3, 1.00, 0),
(156, 26, 1, 4, 1.00, 0),
(157, 26, 1, 5, 1.00, 0),
(158, 26, 2, 1, 1.00, 0),
(159, 26, 2, 2, 1.00, 0),
(160, 26, 2, 3, 1.00, 0),
(161, 26, 2, 4, 1.00, 0),
(162, 26, 2, 5, 1.00, 0),
(163, 26, 3, 5, 1.00, 0),
(164, 26, 3, 4, 1.00, 0),
(165, 26, 3, 3, 1.00, 0),
(166, 26, 3, 2, 1.00, 0),
(167, 26, 3, 1, 1.00, 0),
(168, 26, 4, 1, 1.00, 0),
(169, 26, 4, 2, 1.00, 0),
(170, 26, 4, 3, 1.00, 0),
(171, 26, 4, 4, 1.00, 0),
(172, 26, 4, 5, 1.00, 0),
(173, 26, 1, 1, 1.00, 0),
(174, 26, 1, 2, 1.00, 0),
(175, 26, 1, 3, 1.00, 0),
(176, 26, 1, 4, 1.00, 0),
(177, 26, 1, 5, 1.00, 0),
(178, 26, 2, 1, 1.00, 0),
(179, 26, 2, 2, 1.00, 0),
(180, 26, 2, 3, 1.00, 0),
(181, 26, 2, 4, 1.00, 0),
(182, 26, 2, 5, 1.00, 0),
(183, 26, 3, 5, 1.00, 0),
(184, 26, 3, 4, 1.00, 0),
(185, 26, 3, 3, 1.00, 0),
(186, 26, 3, 2, 1.00, 0),
(187, 26, 3, 1, 1.00, 0),
(188, 26, 4, 1, 1.00, 0),
(189, 26, 4, 2, 1.00, 0),
(190, 26, 4, 3, 1.00, 0),
(191, 26, 4, 4, 1.00, 0),
(192, 26, 4, 5, 1.00, 0),
(193, 3, 1, 1, 9.00, 0),
(194, 3, 2, 1, 3.00, 0),
(195, 2, 1, 1, -48.00, 0),
(196, 2, 2, 1, -31.50, 0),
(197, 2, 3, 1, -38.00, 0),
(198, 2, 4, 1, -25.00, 0),
(199, 27, 1, 1, 9.00, 0),
(200, 27, 1, 2, 9.00, 0),
(201, 27, 1, 3, 9.00, 0),
(202, 27, 1, 4, 9.00, 0),
(203, 27, 1, 5, 9.00, 0),
(204, 27, 2, 1, 9.00, 0),
(205, 27, 2, 2, 9.00, 0),
(206, 27, 2, 3, 9.00, 0),
(207, 27, 2, 4, 9.00, 0),
(208, 27, 2, 5, 8.50, 0),
(209, 27, 3, 1, 9.00, 0),
(210, 27, 3, 2, 9.00, 0),
(211, 27, 3, 3, 9.00, 0),
(212, 27, 3, 4, 9.00, 0),
(213, 27, 3, 5, 9.00, 0),
(214, 27, 4, 1, 9.00, 0),
(215, 27, 4, 2, 9.00, 0),
(216, 27, 4, 3, 9.00, 0),
(217, 27, 4, 4, 9.00, 0),
(218, 27, 4, 5, 9.00, 0),
(219, 2, 1, 1, 8.00, 2025),
(220, 2, 1, 1, 8.00, 2025),
(221, 2, 1, 2, 9.00, 2025),
(222, 2, 4, 5, 10.00, 2024),
(223, 2, 1, 3, 9.00, 2025),
(224, 2, 1, 4, 2.00, 2025),
(225, 2, 1, 5, 2.00, 2025),
(226, 2, 2, 1, 8.00, 2025),
(227, 2, 2, 2, 8.00, 2025),
(228, 2, 2, 3, 8.00, 2025),
(229, 2, 2, 4, 8.00, 2025),
(230, 2, 2, 5, 8.00, 2025),
(231, 24, 1, 3, 10.00, 2025),
(232, 24, 1, 4, 1.00, 2025),
(233, 24, 1, 5, 2.00, 2025),
(234, 2, 3, 1, 7.00, 2025),
(235, 2, 3, 2, 7.00, 2025),
(236, 3, 1, 2, 8.00, 2025),
(237, 3, 1, 3, 8.00, 2025),
(238, 3, 1, 4, 8.00, 2025),
(239, 3, 1, 5, 8.00, 2025),
(240, 2, 3, 3, 5.00, 2025),
(241, 2, 3, 4, 7.00, 2025),
(242, 2, 3, 5, 8.00, 2025),
(243, 2, 4, 1, 8.00, 2025),
(244, 2, 4, 2, 10.00, 2025),
(245, 2, 4, 3, 2.00, 2025);

-- --------------------------------------------------------

--
-- Table structure for table `perfil`
--

CREATE TABLE `perfil` (
  `id_perfil` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `whatsapp` varchar(255) DEFAULT NULL,
  `whatsapp_adulto` varchar(255) DEFAULT NULL,
  `mail` varchar(255) NOT NULL,
  `id_foto` int(11) NOT NULL,
  `id_alumno` int(11) DEFAULT NULL,
  `id_profesor` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `perfil`
--

INSERT INTO `perfil` (`id_perfil`, `nombre`, `whatsapp`, `whatsapp_adulto`, `mail`, `id_foto`, `id_alumno`, `id_profesor`) VALUES
(1, 'Sol Vega', '2364310385', '236430086', 'solsv7@gmail.com', 6, 2, NULL),
(2, 'valentino catania', '2358450038', '0000000000000', 'valen10catania@gmail.com', 0, 29, NULL),
(3, 'Carolina Lombardo', NULL, NULL, 'correocaro@gmail.com', 0, NULL, 23),
(4, 'Lautaro Andrés ', '65456546', '', 'lauti@gmail.com', 0, 30, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `periodos`
--

CREATE TABLE `periodos` (
  `id_periodo` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `activo` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `periodos`
--

INSERT INTO `periodos` (`id_periodo`, `nombre`, `activo`) VALUES
(1, 'Primer Periodo', 1),
(2, 'Segundo Periodo', 1),
(3, 'Primer Proceso Evolutivo', 1),
(4, 'Segundo Proceso Evolutivo', 1),
(5, 'Trimestre 1', 0),
(6, 'Tercer Periodo Evaluativo', 0);

-- --------------------------------------------------------

--
-- Table structure for table `planes`
--

CREATE TABLE `planes` (
  `id_plan` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `monto` decimal(10,2) NOT NULL,
  `activa` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `planes`
--

INSERT INTO `planes` (`id_plan`, `nombre`, `descripcion`, `monto`, `activa`) VALUES
(1, 'Plan Mensual Actualizado', 'Actualizado', 16000.00, 0),
(2, 'Plan Mensual', 'Pago mensual de clases', 30000.00, 1),
(3, 'Plan Mensual Avanzado', 'Pago mensual de clases avanzadas', 35000.00, 1);

-- --------------------------------------------------------

--
-- Table structure for table `profesor`
--

CREATE TABLE `profesor` (
  `id_profesor` int(11) NOT NULL,
  `dni` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `userId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `profesor`
--

INSERT INTO `profesor` (`id_profesor`, `dni`, `nombre`, `userId`, `createdAt`, `updatedAt`) VALUES
(15, 12345678, 'Juan Pérez', 26, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(16, 41991329, 'Lautaro Bustamente', 27, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(17, 41991330, 'Lautaro Bustamenti', 32, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(18, 41991331, 'Tomas Gonzalez', 33, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(19, 63456789, 'Agustina', 40, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(20, 46411952, 'Lautaro Bustamante', 43, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(21, 12564323, 'Francina Manssino', 54, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(23, 27015928, 'Carolina Lombardo', 65, '0000-00-00 00:00:00', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id_rol` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id_rol`, `nombre`) VALUES
(1, 'Admin'),
(2, 'Teacher'),
(3, 'Student'),
(4, 'Guest');

-- --------------------------------------------------------

--
-- Table structure for table `tipo_nota`
--

CREATE TABLE `tipo_nota` (
  `id_tipo` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tipo_nota`
--

INSERT INTO `tipo_nota` (`id_tipo`, `nombre`) VALUES
(1, 'Expresion Oral'),
(2, 'Expresion Escrita'),
(3, 'Expresion Auditiva'),
(4, 'Estrategias, desarrollo y resolucion'),
(5, 'Actitud y desempeño');

-- --------------------------------------------------------

--
-- Table structure for table `usuario`
--

CREATE TABLE `usuario` (
  `id_usuario` int(11) NOT NULL,
  `id_alumno` int(11) DEFAULT NULL,
  `id_profesor` int(11) DEFAULT NULL,
  `id_rol` int(11) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `usuario`
--

INSERT INTO `usuario` (`id_usuario`, `id_alumno`, `id_profesor`, `id_rol`, `password`) VALUES
(3, 2, NULL, 3, '$2a$10$Xf.tpdd52C14A6pOpuRQs.jShrB/aOP2Dq.jEIKjL3P6vtvN8Yq42'),
(4, 3, NULL, 3, '$2a$10$j3CLi3AjQPUEdcb8sZOnGuxdYtIjz/oHkOUq3F.5f7R9bGGDG9Vhe'),
(26, NULL, 15, 2, 'password123'),
(27, NULL, 16, 2, '$2a$10$uPZHRUvII9UjnvqF/lvovempgBL2NNm/UKAoNokKWtCoUwYyu4JQG'),
(28, NULL, NULL, 3, '$2a$10$6wNo.Kw7M3Z12UoshIqmPOVMWBpl5KitbYUPW1dwqPICV7o2pvriG'),
(29, NULL, NULL, 3, '$2a$10$VhCgq8D54k714FD3W753.uHoXkPaloKpnlVxncNmbg3rIrokAdkRO'),
(30, NULL, NULL, 3, '$2a$10$0N/G5HjyKLBTsav7teo4tOYOPwrfl5Kr1SpmgboABdSRWh0/dJdqa'),
(31, NULL, NULL, 3, '$2a$10$Cp4SamwT0DQFH7qCQ36dWeKFga9vKd0CPUKom797WXFJj7aJfFpG2'),
(32, NULL, 17, 2, '$2a$10$662h7xHyQIaTCzd1lD21FOcdWj0WNRTR1gAMrytU9oowTP.Gpl2yW'),
(33, NULL, 18, 2, '$2a$10$0PEEiwe3ev5j8jNBlF4x2OzLK9QGO6FhPjMWWpxzH.qgGGP8Z.9lK'),
(34, NULL, NULL, 3, '$2a$10$q8vZEFZp9ijSxOxfnzM4DuSDJUAeh14LosyheYRK6935S1OCxB3hi'),
(35, NULL, NULL, 3, '$2a$10$NJ/IHHSQRImGzO.9jG76FudIelgJaxDB0qP0Q43mvpVGiR.W6dNs2'),
(36, NULL, NULL, 3, '$2a$10$5.uCXfLCLFYYdRVKD.mx0e2kFzuGGWa1eJQHIkxQAa1cyYj/qVm7.'),
(37, NULL, NULL, 3, '$2a$10$lOZ48S9/KugrpLs5Md.1JOQOS7qT/.AMXBJZjkSVZY1Ush6Olf0tW'),
(38, NULL, NULL, 3, '$2a$10$zv/l0X8k9u/ct4WhOrftiuAqwIcyXCRMeYmwzjNtF4N45hFj8jduC'),
(39, NULL, NULL, 3, '$2a$10$blE3TCG1.Z4lDJDvvNj2Tu5pYULx9d0O/Jjl0DteAT7VayQBHRNSi'),
(40, NULL, 19, 2, '$2a$10$rviN/sjBCGgLUz7h1xGWe.xmLNVsOBtQcRdpd0G8yAsTGFu9NCSIm'),
(41, NULL, NULL, 3, '$2a$10$cIGzp6RbnM32Q3GkDhHiuOmlwgqRVH7Rri1ivOORvaz0tfEZh.ypa'),
(42, NULL, NULL, 3, '$2a$10$yQviARg4DRk2TBQFLtcoRO8Yfq.B8djHUaJk.qf3dU51dfjz0X2C6'),
(43, NULL, 20, 2, '$2a$10$pmenv7IbHWQdpIusPw5lseeZzsBT1M3br7csc0TLrA1FV3M7iGwqa'),
(44, NULL, NULL, 3, '$2a$10$p8vwdvdptr9B9EZzBeTWjOW.ipSfgz7nTy7bkB3uypShckOtDWDuG'),
(45, NULL, NULL, 3, '$2a$10$810fpD09XfJtXIJyTse8eOl0zQxYC0my7hM.L7x87U0X4nIPHaEQC'),
(46, NULL, NULL, 3, '$2a$10$z/h9MDIs4Nout4.EytrfpO.ojFDD0VsT0LsEXQSvikDruzICVtjxm'),
(47, NULL, NULL, 3, '$2a$10$QSKh2PchZcsPCNQFXur/8ut9HnTNjBF/kO2Q51JmL.e0rOrb3k7R2'),
(48, NULL, NULL, 3, '$2a$10$pYhUvwSusJa4sHfSn0kfpug.AEDgf6WD9olzctR4CeJ4sWuPOhYKS'),
(49, NULL, NULL, 3, '$2a$10$t9speKV9QutPGeSGJaCGWe1jAUDXlpXDACN8GbexLRBRIb7kuNmz2'),
(50, NULL, NULL, 3, '$2a$10$Uqaok8jh82f4AUAhyOB.LeHAVs3ALzAS/D.AFbiHaAv9N10X8blha'),
(51, NULL, NULL, 3, '$2a$10$kS8jSxFKv8AbEJOsKHFVVegHQdHclg6IVdxd./fI.NM58iiewKFaa'),
(52, 24, NULL, 3, '$2a$10$JfkWm4ILW/TH.pRl/JC02ugpNeKfsrPFujDV4pIbweYVhiQp27RX.'),
(53, 25, NULL, 3, '$2a$10$0vTXizochSgNApzuHFWQmeUZEz9.enCN8jTO6PgX95T6anrBbMWYW'),
(54, NULL, 21, 2, '$2a$10$AF.yTfEsuZwlyBRi9dfQ.OJO8NZvbI4vtljaZDVRUn5nObdyH8fz.'),
(55, 26, NULL, 3, '$2a$10$g2zHvMR2tRPMT.Lxok7IjulNd0vHApYW8DO2zdhPM3LRiV52E660e'),
(56, 27, NULL, 3, '$2a$10$E6Hu8L2zO1Bc/F2kuyhh/uQvVw2MQLZJy/fOjLBGF.oGaCZy18i2q'),
(57, 27, NULL, 3, '$2a$10$7iGLTlgtUsk5abJky/0S0.2MTJ1BwcQQtOnmaswaN1BAIZkTCfteS'),
(58, NULL, NULL, 3, '$2a$10$Qf15VcPEV1y.6Wmou0Ac6.//INEigOB1USNaUWwEEqGQSCaDSEjQe'),
(59, NULL, NULL, 3, '$2a$10$ajJpDZVuhVOCfet.yyBnGO3kFQJM55ifhPMc4yHH7GOcE34YyzHPu'),
(60, NULL, NULL, 3, '$2a$10$Xm42ANb2/9MJtN569qsmleaLkQfH/D0Oaldcb4uTxuT7dOme6ofTq'),
(61, NULL, NULL, 3, '$2a$10$24KNMxvjFU99z36SQcM8re/iu3go.K7QCOZs3HmoUu3GOOLsJeUlK'),
(62, NULL, NULL, 3, '$2a$10$G/XcYTDjg5QKmH/yjCudjOs11woLf7w5bh9EcQRFbn4QEPJGd78k6'),
(63, 29, NULL, 3, '$2a$10$fuIvJXI..FzagkqcV2UjiO1hj4rXeJZ4x.FYV3m62TF3iTGHArlK.'),
(64, NULL, NULL, 2, '$2a$10$PwJ5Fhhl7jRiT5joLDzV6.21Oq3fdGkk7q7p2JxAqIrTz57o6yhBi'),
(65, NULL, 23, 2, '$2a$10$xhXJ1GfGr4IVw5UxsM.eXOeh3jYXbS9YSGB1e9mLcLrBVlBnn7xb.'),
(66, 30, NULL, 3, '$2a$10$2foiw5fh364WPc11DIElGe0t3TKU59vIiYDkFtyx5Y179/IDaQFwW'),
(67, NULL, NULL, 4, '$2a$10$0aBSKVHWs.cJCJWRtz1R4Or8/pZSS0RKGGYkgxZaApxg.QxpUrJ8u'),
(68, NULL, NULL, 4, '$2a$10$nJ9qhq7rYoL897lFyGHBeudAK0aP92i84hs4ew6ikr4hMCboGl9KG'),
(69, NULL, NULL, 4, '$2a$10$HVH.pzslRBCiCDnAt6HOduWwtV/whXQnC8hTxGzel31kFRxVhH3su'),
(71, 32, NULL, 4, '$2a$10$0Gv2DY5/EAWVsuBcKwGdL.w2qOqT3POuOwfeWaMpKP2iQQt458x.G');

-- --------------------------------------------------------

--
-- Table structure for table `videos`
--

CREATE TABLE `videos` (
  `id_video` int(11) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `idioma` varchar(255) NOT NULL,
  `url` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `videos`
--

INSERT INTO `videos` (`id_video`, `titulo`, `idioma`, `url`) VALUES
(4, '505 - Artic Monkeys', 'Ingles', 'https://www.youtube.com/watch?v=qU9mHegkTc4');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `alumno`
--
ALTER TABLE `alumno`
  ADD PRIMARY KEY (`id_alumno`),
  ADD UNIQUE KEY `dni_alumno` (`dni_alumno`),
  ADD KEY `id_clase` (`id_clase`);

--
-- Indexes for table `asistencia`
--
ALTER TABLE `asistencia`
  ADD PRIMARY KEY (`id_asistencia`),
  ADD KEY `id_alumno` (`id_alumno`);

--
-- Indexes for table `clases`
--
ALTER TABLE `clases`
  ADD PRIMARY KEY (`id_clase`),
  ADD KEY `id_nivel` (`id_nivel`),
  ADD KEY `id_dia` (`id_dia`);

--
-- Indexes for table `clases_alumnos`
--
ALTER TABLE `clases_alumnos`
  ADD PRIMARY KEY (`id_alumno`,`id_clase`),
  ADD KEY `id_clase` (`id_clase`);

--
-- Indexes for table `clases_usuarios`
--
ALTER TABLE `clases_usuarios`
  ADD PRIMARY KEY (`id_alumno`,`id_clase`,`fecha`),
  ADD KEY `id_clase` (`id_clase`);

--
-- Indexes for table `cuotas`
--
ALTER TABLE `cuotas`
  ADD PRIMARY KEY (`id_cuota`),
  ADD KEY `id_alumno` (`id_alumno`),
  ADD KEY `id_plan` (`id_plan`);

--
-- Indexes for table `dias`
--
ALTER TABLE `dias`
  ADD PRIMARY KEY (`id_dia`);

--
-- Indexes for table `formularios`
--
ALTER TABLE `formularios`
  ADD PRIMARY KEY (`id_formulario`);

--
-- Indexes for table `mensajes`
--
ALTER TABLE `mensajes`
  ADD PRIMARY KEY (`id_mensaje`);

--
-- Indexes for table `niveles`
--
ALTER TABLE `niveles`
  ADD PRIMARY KEY (`id_nivel`);

--
-- Indexes for table `notas`
--
ALTER TABLE `notas`
  ADD PRIMARY KEY (`id_nota`),
  ADD KEY `id_alumno` (`id_alumno`),
  ADD KEY `id_periodo` (`id_periodo`),
  ADD KEY `id_tipo_nota` (`id_tipo_nota`);

--
-- Indexes for table `perfil`
--
ALTER TABLE `perfil`
  ADD PRIMARY KEY (`id_perfil`);

--
-- Indexes for table `periodos`
--
ALTER TABLE `periodos`
  ADD PRIMARY KEY (`id_periodo`);

--
-- Indexes for table `planes`
--
ALTER TABLE `planes`
  ADD PRIMARY KEY (`id_plan`);

--
-- Indexes for table `profesor`
--
ALTER TABLE `profesor`
  ADD PRIMARY KEY (`id_profesor`),
  ADD UNIQUE KEY `dni` (`dni`),
  ADD KEY `profesor_userId_foreign_idx` (`userId`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id_rol`);

--
-- Indexes for table `tipo_nota`
--
ALTER TABLE `tipo_nota`
  ADD PRIMARY KEY (`id_tipo`);

--
-- Indexes for table `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_usuario`),
  ADD KEY `id_alumno` (`id_alumno`),
  ADD KEY `id_profesor` (`id_profesor`),
  ADD KEY `id_rol` (`id_rol`);

--
-- Indexes for table `videos`
--
ALTER TABLE `videos`
  ADD PRIMARY KEY (`id_video`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `alumno`
--
ALTER TABLE `alumno`
  MODIFY `id_alumno` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `asistencia`
--
ALTER TABLE `asistencia`
  MODIFY `id_asistencia` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `clases`
--
ALTER TABLE `clases`
  MODIFY `id_clase` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `cuotas`
--
ALTER TABLE `cuotas`
  MODIFY `id_cuota` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `dias`
--
ALTER TABLE `dias`
  MODIFY `id_dia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `formularios`
--
ALTER TABLE `formularios`
  MODIFY `id_formulario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `mensajes`
--
ALTER TABLE `mensajes`
  MODIFY `id_mensaje` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;

--
-- AUTO_INCREMENT for table `niveles`
--
ALTER TABLE `niveles`
  MODIFY `id_nivel` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `notas`
--
ALTER TABLE `notas`
  MODIFY `id_nota` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=246;

--
-- AUTO_INCREMENT for table `perfil`
--
ALTER TABLE `perfil`
  MODIFY `id_perfil` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `periodos`
--
ALTER TABLE `periodos`
  MODIFY `id_periodo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `planes`
--
ALTER TABLE `planes`
  MODIFY `id_plan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `profesor`
--
ALTER TABLE `profesor`
  MODIFY `id_profesor` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id_rol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `tipo_nota`
--
ALTER TABLE `tipo_nota`
  MODIFY `id_tipo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=72;

--
-- AUTO_INCREMENT for table `videos`
--
ALTER TABLE `videos`
  MODIFY `id_video` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `alumno`
--
ALTER TABLE `alumno`
  ADD CONSTRAINT `alumno_ibfk_1` FOREIGN KEY (`id_clase`) REFERENCES `clases` (`id_clase`);

--
-- Constraints for table `asistencia`
--
ALTER TABLE `asistencia`
  ADD CONSTRAINT `asistencia_ibfk_1` FOREIGN KEY (`id_alumno`) REFERENCES `alumno` (`id_alumno`);

--
-- Constraints for table `clases`
--
ALTER TABLE `clases`
  ADD CONSTRAINT `clases_ibfk_1` FOREIGN KEY (`id_nivel`) REFERENCES `niveles` (`id_nivel`),
  ADD CONSTRAINT `clases_ibfk_2` FOREIGN KEY (`id_dia`) REFERENCES `dias` (`id_dia`);

--
-- Constraints for table `clases_alumnos`
--
ALTER TABLE `clases_alumnos`
  ADD CONSTRAINT `clases_alumnos_ibfk_1` FOREIGN KEY (`id_alumno`) REFERENCES `alumno` (`id_alumno`),
  ADD CONSTRAINT `clases_alumnos_ibfk_2` FOREIGN KEY (`id_clase`) REFERENCES `clases` (`id_clase`);

--
-- Constraints for table `clases_usuarios`
--
ALTER TABLE `clases_usuarios`
  ADD CONSTRAINT `clases_usuarios_ibfk_1` FOREIGN KEY (`id_alumno`) REFERENCES `alumno` (`id_alumno`),
  ADD CONSTRAINT `clases_usuarios_ibfk_2` FOREIGN KEY (`id_clase`) REFERENCES `clases` (`id_clase`);

--
-- Constraints for table `cuotas`
--
ALTER TABLE `cuotas`
  ADD CONSTRAINT `cuotas_ibfk_1` FOREIGN KEY (`id_alumno`) REFERENCES `alumno` (`id_alumno`),
  ADD CONSTRAINT `cuotas_ibfk_2` FOREIGN KEY (`id_plan`) REFERENCES `planes` (`id_plan`);

--
-- Constraints for table `notas`
--
ALTER TABLE `notas`
  ADD CONSTRAINT `notas_ibfk_1` FOREIGN KEY (`id_alumno`) REFERENCES `alumno` (`id_alumno`),
  ADD CONSTRAINT `notas_ibfk_2` FOREIGN KEY (`id_periodo`) REFERENCES `periodos` (`id_periodo`),
  ADD CONSTRAINT `notas_ibfk_3` FOREIGN KEY (`id_tipo_nota`) REFERENCES `tipo_nota` (`id_tipo`);

--
-- Constraints for table `profesor`
--
ALTER TABLE `profesor`
  ADD CONSTRAINT `profesor_userId_foreign_idx` FOREIGN KEY (`userId`) REFERENCES `usuario` (`id_usuario`);

--
-- Constraints for table `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`id_alumno`) REFERENCES `alumno` (`id_alumno`),
  ADD CONSTRAINT `usuario_ibfk_2` FOREIGN KEY (`id_profesor`) REFERENCES `profesor` (`id_profesor`),
  ADD CONSTRAINT `usuario_ibfk_3` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
