/*
 *   Copyright (c) 2026  @MiaoSong
 *   All rights reserved.
 *   作者 @MiaoSong，供学习使用
 */

import { Module } from '@nestjs/common'

import { WorkflowController } from './workflow.controller'
import { WorkflowService } from './workflow.service'

@Module({
    controllers: [WorkflowController],
    providers: [WorkflowService],
    exports: [WorkflowService],
})
export class WorkflowModule {}
