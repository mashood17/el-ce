import qrcode
from qrcode.image.styledpil import StyledPilImage
from qrcode.image.styles.moduledrawers import RoundedModuleDrawer
from qrcode.image.styles.colormasks import SolidFillColorMask

URL = "https://el-ce.vercel.app/"

qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_H,
    box_size=12,
    border=3,
)

qr.add_data(URL)
qr.make(fit=True)

img = qr.make_image(
    image_factory=StyledPilImage,
    module_drawer=RoundedModuleDrawer(),
    color_mask=SolidFillColorMask(
        front_color=(181, 138, 22),   # ELATŌ Gold
        back_color=(248, 244, 236),   # ELATŌ Cream
    )
)

img.save("generated/elato_qr.png")

print("ELATŌ QR generated successfully")