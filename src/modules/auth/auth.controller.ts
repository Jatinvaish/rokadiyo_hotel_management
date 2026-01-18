import { Controller, Post, Body, UseGuards, Param, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/core/decorators/public.decorator';
import { Unencrypted } from 'src/core/decorators/unencrypted.decorator';
import { CurrentUser } from 'src/core/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/core/guards/roles.guard';
import { UserType } from 'src/common/constants/user-types.constant';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { SendInvitationDto, AcceptInvitationDto, RejectInvitationDto } from './dto/invitation.dto';

@ApiTags('Authentication')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private auth: AuthService) {}

  // ==================== PUBLIC ENDPOINTS ====================

  @Public()
  @Unencrypted()
  @Post('register')
  @ApiOperation({ summary: 'Register new user (Public)' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  async register(@Body() dto: RegisterDto) {
    const user = await this.auth.register(dto);
    return { message: 'Registration successful', data: user };
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  async login(@Body() dto: LoginDto) {
    const result = await this.auth.login(dto.identifier, dto.password);
    return { message: 'Login successful', data: result };
  }

  // ==================== PROTECTED ENDPOINTS ====================

  @Post('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved' })
  async getProfile(@CurrentUser() user: any) {
    return { message: 'User profile', data: user };
  }

  // ==================== SUPER ADMIN ONLY ====================

  @Post('tenant/create')
  @UseGuards(RolesGuard)
  @Roles(UserType.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Super Admin: Create tenant with credentials' })
  @ApiResponse({ status: 201, description: 'Tenant created successfully' })
  async createTenant(
    @CurrentUser() user: any,
    @Body() dto: CreateTenantDto
  ) {
    const result = await this.auth.createTenantWithUser(user, dto);
    return { message: 'Tenant created successfully', data: result };
  }

  // ==================== INVITATION ENDPOINTS ====================

  @Post('invitation/send')
  @UseGuards(RolesGuard)
  @Roles(UserType.SUPER_ADMIN, UserType.TENANT_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Send invitation to user' })
  @ApiResponse({ status: 201, description: 'Invitation sent successfully' })
  async sendInvitation(
    @CurrentUser() user: any,
    @Body() dto: SendInvitationDto
  ) {
    const result = await this.auth.sendInvitation(user, dto);
    return { message: 'Invitation sent successfully', data: result };
  }

  @Public()
  @Post('invitation/accept/:token')
  @ApiOperation({ summary: 'Accept invitation' })
  @ApiResponse({ status: 200, description: 'Invitation accepted successfully' })
  async acceptInvitation(
    @Param('token') token: string,
    @Body() dto: AcceptInvitationDto
  ) {
    const result = await this.auth.acceptInvitation(token, dto);
    return { message: 'Invitation accepted successfully', data: result };
  }

  @Public()
  @Patch('invitation/reject/:token')
  @ApiOperation({ summary: 'Reject invitation' })
  @ApiResponse({ status: 200, description: 'Invitation rejected' })
  async rejectInvitation(
    @Param('token') token: string,
    @Body() dto: RejectInvitationDto
  ) {
    await this.auth.rejectInvitation(token, dto.reason);
    return { message: 'Invitation rejected' };
  }
}