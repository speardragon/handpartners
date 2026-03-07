-- company.representative_name: '홍길동' 기본값 → name에서 사람 이름 추출
-- 패턴별 추출 규칙:
--   (prefix) thing_이름    → 마지막 _ 뒤 한글 이름
--   (prefix) 이름_N조      → _ 앞 한글 이름
--   (prefix) 이름           → 괄호 뒤 한글 이름
--   [prefix] N.이름         → . 뒤 한글 이름
--   [prefix] 이름 - 팀명   → ] 뒤, - 앞 한글 이름
--   [prefix] 이름           → ] 뒤 한글 이름
--   이름(info)              → ( 앞 이름
--   팀명/이름, 팀명_이름   → / 또는 _ 뒤 한글 이름
--   HH / 이름              → / 뒤 한글 이름
--   순수 한글 이름          → 그대로

UPDATE public.company
SET representative_name = CASE
  -- (25동계) 김주현_1조: 괄호 뒤 한글이름_N조
  WHEN name ~ '^\(.*\)\s+[가-힣]{2,4}_\d+조$'
    THEN regexp_replace(name, '^\(.*\)\s+([가-힣]{2,4})_\d+조$', '\1')

  -- (25동계) 정일상_마이필: 괄호 뒤 한글이름_팀명 (N조가 아닌 경우 _ 앞이 사람이름)
  WHEN name ~ '^\(25동계\)\s+[가-힣]{2,4}_'
    THEN regexp_replace(name, '^\(25동계\)\s+([가-힣]{2,4})_.*$', '\1')

  -- (26동북권) 3조_이휘열, (삼육대) 루몽_정준혁 등: 마지막 _ 뒤에 한글이름
  WHEN name ~ '^\(.*\)\s+.*_[가-힣]{2,4}$'
    THEN regexp_replace(name, '^.*_([가-힣]{2,4})$', '\1')

  -- (삼육대) 이지범, (25동계) 장민경: 괄호 뒤 한글이름만
  WHEN name ~ '^\(.*\)\s+[가-힣]{2,4}$'
    THEN regexp_replace(name, '^\(.*\)\s+([가-힣]{2,4})$', '\1')

  -- [prefix] 2.강소라: 대괄호 뒤 숫자.이름
  WHEN name ~ '^\[.*\]\s+\d+\.[가-힣]{2,4}'
    THEN regexp_replace(name, '^\[.*\]\s+\d+\.([가-힣]{2,4}).*$', '\1')

  -- [prefix] 고우빈 - 음파음파: 대괄호 뒤 이름 - 팀명
  WHEN name ~ '^\[.*\]\s+[가-힣]{2,4}\s+-\s+'
    THEN regexp_replace(name, '^\[.*\]\s+([가-힣]{2,4})\s+-\s+.*$', '\1')

  -- [prefix] 박민형: 대괄호 뒤 한글이름만
  WHEN name ~ '^\[.*\]\s+[가-힣]{2,4}$'
    THEN regexp_replace(name, '^\[.*\]\s+([가-힣]{2,4})$', '\1')

  -- [prefix] 김민수: 대괄호 뒤 한글이름 (공백 포함 가능)
  WHEN name ~ '^\[.*\]\s+[가-힣]{2,4}'
    THEN regexp_replace(name, '^\[.*\]\s+([가-힣]{2,4}).*$', '\1')

  -- 이종운(원광대 5조): 이름(정보)
  WHEN name ~ '^[가-힣]{2,4}\(.*\)$'
    THEN regexp_replace(name, '^([가-힣]{2,4})\(.*\)$', '\1')

  -- HH / 김보현: 슬래시 뒤 한글이름
  WHEN name ~ '/\s*[가-힣]{2,4}$'
    THEN regexp_replace(name, '^.*/\s*([가-힣]{2,4})$', '\1')

  -- 9조_서동우: N조_이름
  WHEN name ~ '^\d+조_[가-힣]{2,4}$'
    THEN regexp_replace(name, '^\d+조_([가-힣]{2,4})$', '\1')

  -- 두들_이준영: 팀명_이름 (underscore 뒤 한글)
  WHEN name ~ '_[가-힣]{2,4}$'
    THEN regexp_replace(name, '^.*_([가-힣]{2,4})$', '\1')

  -- 순수 한글 2~4자 이름
  WHEN name ~ '^[가-힣]{2,4}$'
    THEN name

  -- 그 외: name 그대로 (수동 확인 필요)
  ELSE name
END
WHERE representative_name = '홍길동';
