import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { MidiasService } from './midias.service';
import { MediaAsset } from '../entities/media-asset.entity';
import { UploadMidiaInput } from './dto/upload-midia.dto';

@Resolver(() => MediaAsset)
export class MidiasResolver {
  constructor(private readonly midiasService: MidiasService) {}

  @Mutation(() => MediaAsset)
  uploadMidia(@Args('input') input: UploadMidiaInput) {
    return this.midiasService.upload(input);
  }
}
