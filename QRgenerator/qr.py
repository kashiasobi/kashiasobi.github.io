import qrcode

# 1. QR 코드로 변환할 인터넷 주소 입력
url_data = "https://kashiasobi.github.io/event/aooo2606"

# 2. QR 코드 객체 생성 및 세부 설정
qr = qrcode.QRCode(
    version=1,                                 # 1부터 40까지 설정 가능하며, 숫자가 클수록 큐알코드 크기가 커집니다.
    error_correction=qrcode.constants.ERROR_CORRECT_L, # 오류 복원 수준 (L, M, Q, H 중 선택 가능)
    box_size=100,                               # QR 코드의 각 박스(픽셀) 크기
    border=0,                                  # QR 코드의 테두리 굵기 (기본값은 4)
)

# 3. 데이터 추가 및 형태 생성
qr.add_data(url_data)
qr.make(fit=True)

# 4. 이미지로 만들기 (색상 지정 가능)
img = qr.make_image(fill_color="black", back_color="white")

# 5. 이미지 파일로 저장
img.save("my_url_qrcode.png")

print("QR 코드가 성공적으로 생성되어 'my_url_qrcode.png'로 저장되었습니다.")