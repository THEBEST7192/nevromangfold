USE frivilligOrg;

-- 1. Finn alle frivillige
SELECT 
    * 
FROM 
    Brukere;

-- 2. Finn kun visningsnavn
SELECT 
    visningsnavn
FROM 
    Brukere;

-- 3. Finn alle arrangementer
SELECT 
    *
FROM 
    Arrangementer;

-- 4. Finn alle frivillige som er påmeldt arrangementet med ID = 1
SELECT 
    B.brukernavn,
    B.email,
    B.visningsnavn
FROM 
    Brukere AS B
INNER JOIN 
    Paameldte AS P
    ON B.brukernavn = P.brukernavn
WHERE 
    P.arrangementID = 1;

-- 5. Finn arrangementer som starter i 2026, og tell antall påmeldte
SELECT 
    A.tittel,
    A.start,
    COUNT(P.brukernavn) AS antallPaameldte
FROM 
    Arrangementer AS A
INNER JOIN 
    Paameldte AS P
    ON A.arrangementID = P.arrangementID
WHERE 
    YEAR(A.start) = 2026
GROUP BY 
    A.arrangementID, A.tittel, A.start
ORDER BY 
    A.start ASC;
