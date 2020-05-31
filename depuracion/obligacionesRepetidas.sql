SELECT * FROM

`EmpresaObligacion` EO
left outer join `ObligacionFecha` OBF ON (OBF.id = EO.obligacionFechaId)
left outer join `Obligacion` OB ON (OB.id = OBF.obligacionId)
left outer join `ObligacionAnio` OA ON(OA.id = OB.obligacionAnioId)
WHERE
	empresaId = @vertice_empresaId
	AND
	obligacionFechaId
	IN
		(
			SELECT   `obligacionFechaId`
			FROM `vertice`.`EmpresaObligacion`
			GROUP BY empresaid, obligacionFechaId
			HAVING count(*) > 1
		)

ORDER BY obligacionFechaId
