<?php

namespace App\Form;

use App\Entity\Changelog;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ChangelogType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
          ->add('title', TextType::class, [
              'label' => 'Başlık',
              'required' => true,
              'attr' => ['placeholder' => 'Başlık'],
          ])
          ->add('content', TextareaType::class, [
              'label' => 'Açıklama',
              'required' => true,
              'attr' => ['placeholder' => 'Açıklama... html,css kabul eder.', 'rows' => 6],
          ])
          ->add('important', CheckboxType::class, [
              'label' => 'Önemli mi?',
              'required' => false,
          ]);
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
          'data_class' => Changelog::class,
        ]);
    }
}
