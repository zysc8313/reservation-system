import { getModelForClass, pre, prop } from '@typegoose/typegoose';
import bcrypt from 'bcrypt';
import { Field, ObjectType } from 'type-graphql';

@pre<User>('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hash = bcrypt.hashSync(this.password, salt);

  this.password = hash;
})
@ObjectType()
export class User {
  @Field(() => String)
  readonly _id: string;

  @Field(() => String)
  @prop({ type: String, required: true, unique: true })
  email: string;

  @prop({ type: String, required: true })
  password: string;

  @Field(() => String, { nullable: true })
  @prop({ type: String })
  role?: string;
}

export const UserModel = getModelForClass(User);
