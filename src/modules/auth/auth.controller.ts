import { Controller, Post, Body, UseGuards, Param, Get, Query, Logger } from '@nestjs/common';
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
  private logger = new Logger(AuthController.name);

  constructor(private auth: AuthService) { }

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
    this.logger.log('=====================================');
    this.logger.log('🚀 CREATE TENANT ENDPOINT CALLED');
    this.logger.log('=====================================');
    this.logger.log(`Current User: ${JSON.stringify(user)}`);
    this.logger.log(`User Type: ${user?.userType}`);
    this.logger.log(`User ID: ${user?.id}`);
    this.logger.log(`DTO Received: ${JSON.stringify(dto)}`);
    
    try {
      this.logger.log('📞 Calling auth.createTenantWithUser service...');
      const result = await this.auth.createTenantWithUser(user, dto);
      this.logger.log(`✅ Tenant created successfully!`);
      this.logger.log(`Result: ${JSON.stringify(result)}`);
      return { message: 'Tenant created successfully', data: result };
    } catch (error) {
      this.logger.error(`❌ Error creating tenant: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Post('tenants/list')
  @UseGuards(RolesGuard)
  @Roles(UserType.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Super Admin: Get all tenants with pagination' })
  @ApiResponse({ status: 200, description: 'Tenants retrieved successfully' })
  async getTenantsList(
    @Body() params?: { page?: number; limit?: number; search?: string; is_active?: boolean }
  ) {
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const search = params?.search;
    const is_active = params?.is_active;
    
    const result = await this.auth.getTenantsList(
      page,
      limit,
      search,
      is_active
    );
    return { message: 'Tenants retrieved', data: result };
  }

  @Post('tenants/get/:id')
  @UseGuards(RolesGuard)
  @Roles(UserType.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Super Admin: Get tenant by ID' })
  @ApiResponse({ status: 200, description: 'Tenant retrieved successfully' })
  async getTenantById(@Param('id') id: string) {
    const result = await this.auth.getTenantById(parseInt(id));
    return { message: 'Tenant retrieved', data: result };
  }

  @Post('tenants/update/:id')
  @UseGuards(RolesGuard)
  @Roles(UserType.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Super Admin: Update tenant' })
  @ApiResponse({ status: 200, description: 'Tenant updated successfully' })
  async updateTenant(
    @Param('id') id: string,
    @Body() dto: Partial<CreateTenantDto>
  ) {
    const result = await this.auth.updateTenant(parseInt(id), dto);
    return { message: 'Tenant updated successfully', data: result };
  }

  @Post('tenants/:id/activate')
  @UseGuards(RolesGuard)
  @Roles(UserType.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Super Admin: Activate tenant' })
  @ApiResponse({ status: 200, description: 'Tenant activated successfully' })
  async activateTenant(@Param('id') id: string) {
    const result = await this.auth.activateTenant(parseInt(id));
    return { message: 'Tenant activated', data: result };
  }

  @Post('tenants/:id/deactivate')
  @UseGuards(RolesGuard)
  @Roles(UserType.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Super Admin: Deactivate tenant' })
  @ApiResponse({ status: 200, description: 'Tenant deactivated successfully' })
  async deactivateTenant(@Param('id') id: string) {
    const result = await this.auth.deactivateTenant(parseInt(id));
    return { message: 'Tenant deactivated', data: result };
  }

  @Post('tenants/:id/delete')
  @UseGuards(RolesGuard)
  @Roles(UserType.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Super Admin: Delete tenant' })
  @ApiResponse({ status: 200, description: 'Tenant deleted successfully' })
  async deleteTenant(@Param('id') id: string) {
    await this.auth.deleteTenant(parseInt(id));
    return { message: 'Tenant deleted successfully' };
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
  @Post('invitation/reject/:token')
  @ApiOperation({ summary: 'Reject invitation' })
  @ApiResponse({ status: 200, description: 'Invitation rejected' })
  async rejectInvitation(
    @Param('token') token: string,
    @Body() dto: RejectInvitationDto
  ) {
    await this.auth.rejectInvitation(token, dto.reason);
    return { message: 'Invitation rejected' };
  }

  @Public()
  @Post('forgot-password')
  @ApiOperation({ summary: 'Request password reset' })
  async forgotPassword(@Body() dto: { email: string }) {
    const result = await this.auth.forgotPassword(dto.email);
    return { message: result.message };
  }

  @Public()
  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password with token' })
  async resetPassword(@Body() dto: { token: string; password: string }) {
    const result = await this.auth.resetPassword(dto.token, dto.password);
    return { message: result.message };
  }

  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  async logout(@CurrentUser() user: any) {
    return { message: 'Logout successful' };
  }
}