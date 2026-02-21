from PIL import Image, ImageDraw, ImageFont, ImageFilter 
import textwrap


def apply_overlay(image, headline, subtext, cta):

    draw = ImageDraw.Draw(image)
    width, height = image.size

    # ---------------------------
    # Create soft gradient overlay
    # ---------------------------

    gradient_height = int(height * 0.35)

    gradient = Image.new("RGBA", (width, gradient_height))

    for y in range(gradient_height):
        opacity = int(180 * (y / gradient_height))  # gradual fade
        line = Image.new("RGBA", (width, 1), (0, 0, 0, opacity))
        gradient.paste(line, (0, y))

    image.paste(gradient, (0, height - gradient_height), gradient)

    # ---------------------------
    # Fonts
    # ---------------------------

    headline_font = ImageFont.truetype("arial.ttf", int(height * 0.07))
    subtext_font = ImageFont.truetype("arial.ttf", int(height * 0.035))
    cta_font = ImageFont.truetype("arial.ttf", int(height * 0.04))

    margin = int(width * 0.06)
    current_y = height - gradient_height + int(height * 0.05)

    # ---------------------------
    # HEADLINE
    # ---------------------------

    headline_lines = textwrap.wrap(headline, width=22)

    for line in headline_lines:
        draw.text(
            (margin, current_y),
            line,
            font=headline_font,
            fill=(255, 255, 255)
        )
        current_y += headline_font.size + 8

    current_y += 8

    # ---------------------------
    # SUBTEXT
    # ---------------------------

    sub_lines = textwrap.wrap(subtext, width=38)

    for line in sub_lines:
        draw.text(
            (margin, current_y),
            line,
            font=subtext_font,
            fill=(230, 230, 230)
        )
        current_y += subtext_font.size + 5

    # ---------------------------
    # CTA Button Style
    # ---------------------------

    bbox = draw.textbbox((0, 0), cta, font=cta_font)
    cta_text_width = bbox[2] - bbox[0]
    cta_text_height = bbox[3] - bbox[1]
    button_padding_x = 25
    button_padding_y = 12


    button_x = margin
    button_y = height - int(height * 0.08)

    button_width = cta_text_width + (button_padding_x * 2)
    button_height = cta_text_height + (button_padding_y * 2)

    # Draw button background
    draw.rectangle(
        [
            (button_x, button_y),
            (button_x + button_width, button_y + button_height)
        ],
        fill=(255, 215, 0)  # gold tone
    )

    # Draw CTA text
    draw.text(
        (button_x + button_padding_x, button_y + button_padding_y),
        cta,
        font=cta_font,
        fill=(0, 0, 0)
    )

    return image