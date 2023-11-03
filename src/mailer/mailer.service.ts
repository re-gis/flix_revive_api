/* eslint-disable */
import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';
import { CustomException } from 'src/exceptions/CustomException';

@Injectable()
export class MailerService {
  constructor(private readonly configService: ConfigService) {}

  async sendEmail(email: string, link: string) {
    const emailConfig = this.configService.get('email');
    const passConfig = await this.configService.get('password');

    const transporter = createTransport({
      service: emailConfig.service,
      auth: {
        user: emailConfig,
        pass: emailConfig.password,
      },
    });

    const mailOptions = {
      from: emailConfig.username,
      to: email,
      subject: 'Verify Your Account',
      html: `
        <p>Hello,</p>
        <p>Thank you for registering. Please click the following link to verify your account:</p>
        <a href="${link}">Verify Account</a>
        <p>If you didn't register, you can safely ignore this email.</p>
      `,
    };

    try {
      if (await transporter.sendMail(mailOptions)) {
        return true;
      }
    } catch (error) {
        console.log(error)
      throw new CustomException(
        'Error while sending email',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
